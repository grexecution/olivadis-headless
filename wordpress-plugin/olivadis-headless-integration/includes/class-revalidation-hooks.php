<?php
/**
 * Revalidation Hooks for Next.js
 *
 * Triggers webhooks to Next.js when recipes are created, updated, or deleted
 *
 * @package Olivadis_Headless_Integration
 */

class Olivadis_Revalidation_Hooks {

    /**
     * Constructor
     */
    public function __construct() {
        // Recipe hooks
        add_action('save_post_rezepte', array($this, 'trigger_recipe_revalidation'), 10, 3);
        add_action('before_delete_post', array($this, 'trigger_recipe_deletion'), 10, 2);
        add_action('trashed_post', array($this, 'trigger_recipe_trash'));

        // Recipe category hooks
        add_action('created_rezept_kategorie', array($this, 'trigger_category_change'));
        add_action('edited_rezept_kategorie', array($this, 'trigger_category_change'));
        add_action('delete_rezept_kategorie', array($this, 'trigger_category_change'));
    }

    /**
     * Trigger revalidation when recipe is saved
     */
    public function trigger_recipe_revalidation($post_id, $post, $update) {
        // Avoid infinite loops
        if (wp_is_post_revision($post_id) || wp_is_post_autosave($post_id)) {
            return;
        }

        // Only trigger for published posts
        if ($post->post_status !== 'publish') {
            return;
        }

        $action = $update ? 'updated' : 'created';
        $this->send_revalidation_webhook('recipe', $action, array(
            'id' => $post_id,
            'slug' => $post->post_name,
            'title' => $post->post_title,
        ));
    }

    /**
     * Trigger revalidation when recipe is deleted
     */
    public function trigger_recipe_deletion($post_id, $post) {
        if (!$post || $post->post_type !== 'rezepte') {
            return;
        }

        $this->send_revalidation_webhook('recipe', 'deleted', array(
            'id' => $post_id,
            'slug' => $post->post_name,
        ));
    }

    /**
     * Trigger revalidation when recipe is trashed
     */
    public function trigger_recipe_trash($post_id) {
        $post = get_post($post_id);
        if (!$post || $post->post_type !== 'rezepte') {
            return;
        }

        $this->send_revalidation_webhook('recipe', 'trashed', array(
            'id' => $post_id,
            'slug' => $post->post_name,
        ));
    }

    /**
     * Trigger revalidation when recipe category changes
     */
    public function trigger_category_change($term_id = null) {
        $this->send_revalidation_webhook('recipe_category', 'changed', array(
            'term_id' => $term_id,
        ));
    }

    /**
     * Send webhook to Next.js revalidation endpoint
     */
    private function send_revalidation_webhook($type, $action, $data = array()) {
        // Get settings
        $nextjs_url = get_option('olivadis_nextjs_url');
        $secret_key = get_option('olivadis_revalidation_secret');

        // Validate settings
        if (empty($nextjs_url) || empty($secret_key)) {
            error_log('Olivadis Headless: Next.js URL or secret key not configured');
            return;
        }

        // Prepare webhook URL
        $webhook_url = trailingslashit($nextjs_url) . 'api/revalidate';

        // Prepare payload
        $payload = array(
            'type' => $type,
            'action' => $action,
            'data' => $data,
            'timestamp' => current_time('timestamp'),
        );

        // Prepare request
        $args = array(
            'method' => 'POST',
            'timeout' => 10,
            'headers' => array(
                'Content-Type' => 'application/json',
                'X-Revalidation-Secret' => $secret_key,
            ),
            'body' => wp_json_encode($payload),
        );

        // Send async request (non-blocking)
        wp_remote_post($webhook_url, $args);

        // Log the webhook (for debugging)
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log(sprintf(
                'Olivadis Headless: Webhook sent - Type: %s, Action: %s, Data: %s',
                $type,
                $action,
                wp_json_encode($data)
            ));
        }
    }

    /**
     * Manually trigger full site revalidation
     */
    public static function trigger_full_revalidation() {
        $nextjs_url = get_option('olivadis_nextjs_url');
        $secret_key = get_option('olivadis_revalidation_secret');

        if (empty($nextjs_url) || empty($secret_key)) {
            return new WP_Error('missing_config', 'Next.js URL or secret key not configured');
        }

        $webhook_url = trailingslashit($nextjs_url) . 'api/revalidate';

        $payload = array(
            'type' => 'full',
            'action' => 'revalidate',
            'timestamp' => current_time('timestamp'),
        );

        $args = array(
            'method' => 'POST',
            'timeout' => 10,
            'headers' => array(
                'Content-Type' => 'application/json',
                'X-Revalidation-Secret' => $secret_key,
            ),
            'body' => wp_json_encode($payload),
        );

        $response = wp_remote_post($webhook_url, $args);

        if (is_wp_error($response)) {
            return $response;
        }

        return array(
            'success' => true,
            'message' => 'Full revalidation triggered',
        );
    }
}
