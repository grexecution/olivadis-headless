<?php
/**
 * Product Hooks for WooCommerce
 *
 * Triggers webhooks to Next.js when products are created, updated, or deleted
 *
 * @package Olivadis_Headless_Integration
 */

class Olivadis_Product_Hooks {

    /**
     * Constructor
     */
    public function __construct() {
        // Product hooks
        add_action('woocommerce_new_product', array($this, 'trigger_product_created'), 10, 1);
        add_action('woocommerce_update_product', array($this, 'trigger_product_updated'), 10, 1);
        add_action('before_delete_post', array($this, 'trigger_product_deletion'), 10, 2);
        add_action('wp_trash_post', array($this, 'trigger_product_trash'));

        // Product variation hooks
        add_action('woocommerce_new_product_variation', array($this, 'trigger_variation_change'), 10, 1);
        add_action('woocommerce_update_product_variation', array($this, 'trigger_variation_change'), 10, 1);
        add_action('woocommerce_delete_product_variation', array($this, 'trigger_variation_change'), 10, 1);

        // Product category hooks
        add_action('created_product_cat', array($this, 'trigger_category_change'));
        add_action('edited_product_cat', array($this, 'trigger_category_change'));
        add_action('delete_product_cat', array($this, 'trigger_category_change'));

        // Stock change hooks
        add_action('woocommerce_product_set_stock', array($this, 'trigger_stock_change'), 10, 1);
        add_action('woocommerce_variation_set_stock', array($this, 'trigger_stock_change'), 10, 1);
    }

    /**
     * Trigger revalidation when product is created
     */
    public function trigger_product_created($product_id) {
        $product = wc_get_product($product_id);
        if (!$product) {
            return;
        }

        $this->send_revalidation_webhook('product', 'created', array(
            'id' => $product_id,
            'slug' => $product->get_slug(),
            'name' => $product->get_name(),
            'type' => $product->get_type(),
        ));
    }

    /**
     * Trigger revalidation when product is updated
     */
    public function trigger_product_updated($product_id) {
        $product = wc_get_product($product_id);
        if (!$product) {
            return;
        }

        $this->send_revalidation_webhook('product', 'updated', array(
            'id' => $product_id,
            'slug' => $product->get_slug(),
            'name' => $product->get_name(),
            'type' => $product->get_type(),
        ));
    }

    /**
     * Trigger revalidation when product is deleted
     */
    public function trigger_product_deletion($post_id, $post) {
        if (!$post || $post->post_type !== 'product') {
            return;
        }

        $product = wc_get_product($post_id);
        if (!$product) {
            return;
        }

        $this->send_revalidation_webhook('product', 'deleted', array(
            'id' => $post_id,
            'slug' => $product->get_slug(),
        ));
    }

    /**
     * Trigger revalidation when product is trashed
     */
    public function trigger_product_trash($post_id) {
        $post = get_post($post_id);
        if (!$post || $post->post_type !== 'product') {
            return;
        }

        $product = wc_get_product($post_id);
        if (!$product) {
            return;
        }

        $this->send_revalidation_webhook('product', 'trashed', array(
            'id' => $post_id,
            'slug' => $product->get_slug(),
        ));
    }

    /**
     * Trigger revalidation when product variation changes
     */
    public function trigger_variation_change($variation_id) {
        $variation = wc_get_product($variation_id);
        if (!$variation) {
            return;
        }

        $parent_id = $variation->get_parent_id();

        $this->send_revalidation_webhook('product', 'variation_changed', array(
            'variation_id' => $variation_id,
            'product_id' => $parent_id,
        ));
    }

    /**
     * Trigger revalidation when product category changes
     */
    public function trigger_category_change($term_id = null) {
        $this->send_revalidation_webhook('product_category', 'changed', array(
            'term_id' => $term_id,
        ));
    }

    /**
     * Trigger revalidation when product stock changes
     */
    public function trigger_stock_change($product) {
        if (!$product) {
            return;
        }

        $product_id = $product->get_id();
        $parent_id = $product->get_parent_id();

        $this->send_revalidation_webhook('product', 'stock_changed', array(
            'id' => $product_id,
            'parent_id' => $parent_id,
            'stock_quantity' => $product->get_stock_quantity(),
            'stock_status' => $product->get_stock_status(),
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
                'Olivadis Headless: Product webhook sent - Type: %s, Action: %s, Data: %s',
                $type,
                $action,
                wp_json_encode($data)
            ));
        }
    }
}
