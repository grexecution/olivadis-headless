<?php
/**
 * Plugin Name: Olivadis Headless Integration
 * Plugin URI: https://olivadis.com
 * Description: Integrates recipes custom post type with Next.js headless frontend, including webhooks for automatic revalidation on content changes
 * Version: 1.0.0
 * Author: Olivadis
 * Author URI: https://olivadis.com
 * Text Domain: olivadis-headless
 * Domain Path: /languages
 * Requires at least: 6.0
 * Requires PHP: 7.4
 */

// If this file is called directly, abort.
if (!defined('WPINC')) {
    die;
}

// Define plugin constants
define('OLIVADIS_HEADLESS_VERSION', '1.0.0');
define('OLIVADIS_HEADLESS_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('OLIVADIS_HEADLESS_PLUGIN_URL', plugin_dir_url(__FILE__));

/**
 * The code that runs during plugin activation
 */
function activate_olivadis_headless() {
    // Flush rewrite rules on activation
    flush_rewrite_rules();
}
register_activation_hook(__FILE__, 'activate_olivadis_headless');

/**
 * The code that runs during plugin deactivation
 */
function deactivate_olivadis_headless() {
    // Flush rewrite rules on deactivation
    flush_rewrite_rules();
}
register_deactivation_hook(__FILE__, 'deactivate_olivadis_headless');

/**
 * Begin plugin execution
 */
function run_olivadis_headless() {
    // Load dependencies
    require_once OLIVADIS_HEADLESS_PLUGIN_DIR . 'includes/class-recipe-post-type.php';
    require_once OLIVADIS_HEADLESS_PLUGIN_DIR . 'includes/class-recipe-fields.php';
    require_once OLIVADIS_HEADLESS_PLUGIN_DIR . 'includes/class-revalidation-hooks.php';
    require_once OLIVADIS_HEADLESS_PLUGIN_DIR . 'includes/class-product-hooks.php';
    require_once OLIVADIS_HEADLESS_PLUGIN_DIR . 'includes/class-shipping-hooks.php';
    require_once OLIVADIS_HEADLESS_PLUGIN_DIR . 'admin/admin-settings.php';

    // Initialize recipe post type
    new Olivadis_Recipe_Post_Type();

    // Initialize recipe fields (ACF)
    new Olivadis_Recipe_Fields();

    // Initialize revalidation hooks
    new Olivadis_Revalidation_Hooks();

    // Initialize product hooks
    new Olivadis_Product_Hooks();

    // Initialize shipping hooks
    Olivadis_Shipping_Hooks::init();

    // Initialize admin settings
    new Olivadis_Admin_Settings();
}
add_action('plugins_loaded', 'run_olivadis_headless');

/**
 * Add recipes to WooCommerce REST API
 */
add_action('rest_api_init', function () {
    register_rest_route('olivadis/v1', '/recipes', array(
        'methods' => 'GET',
        'callback' => 'olivadis_get_recipes',
        'permission_callback' => '__return_true',
    ));

    register_rest_route('olivadis/v1', '/recipes/(?P<slug>[a-zA-Z0-9-]+)', array(
        'methods' => 'GET',
        'callback' => 'olivadis_get_recipe',
        'permission_callback' => '__return_true',
    ));

    register_rest_route('olivadis/v1', '/recipe-categories', array(
        'methods' => 'GET',
        'callback' => 'olivadis_get_recipe_categories',
        'permission_callback' => '__return_true',
    ));
});

/**
 * Get all recipes via REST API
 */
function olivadis_get_recipes($request) {
    $per_page = $request->get_param('per_page') ? intval($request->get_param('per_page')) : 100;
    $page = $request->get_param('page') ? intval($request->get_param('page')) : 1;
    $category = $request->get_param('category');

    $args = array(
        'post_type' => 'rezepte',
        'post_status' => 'publish',
        'posts_per_page' => $per_page,
        'paged' => $page,
        'orderby' => 'date',
        'order' => 'DESC',
    );

    // Filter by category if provided
    if ($category) {
        $args['tax_query'] = array(
            array(
                'taxonomy' => 'rezept_kategorie',
                'field' => 'slug',
                'terms' => $category,
            ),
        );
    }

    $query = new WP_Query($args);
    $recipes = array();

    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $recipes[] = olivadis_format_recipe(get_post());
        }
        wp_reset_postdata();
    }

    return new WP_REST_Response(array(
        'recipes' => $recipes,
        'total' => $query->found_posts,
        'pages' => $query->max_num_pages,
    ), 200);
}

/**
 * Get single recipe by slug via REST API
 */
function olivadis_get_recipe($request) {
    $slug = $request->get_param('slug');

    $args = array(
        'post_type' => 'rezepte',
        'name' => $slug,
        'post_status' => 'publish',
        'posts_per_page' => 1,
    );

    $query = new WP_Query($args);

    if ($query->have_posts()) {
        $query->the_post();
        $recipe = olivadis_format_recipe(get_post());
        wp_reset_postdata();
        return new WP_REST_Response($recipe, 200);
    }

    return new WP_Error('recipe_not_found', 'Rezept nicht gefunden', array('status' => 404));
}

/**
 * Get recipe categories via REST API
 */
function olivadis_get_recipe_categories($request) {
    $terms = get_terms(array(
        'taxonomy' => 'rezept_kategorie',
        'hide_empty' => true,
    ));

    if (is_wp_error($terms)) {
        return new WP_Error('categories_error', 'Fehler beim Laden der Kategorien', array('status' => 500));
    }

    $categories = array();
    foreach ($terms as $term) {
        $categories[] = array(
            'id' => $term->term_id,
            'name' => $term->name,
            'slug' => $term->slug,
            'count' => $term->count,
        );
    }

    return new WP_REST_Response($categories, 200);
}

/**
 * Format recipe post for API response
 */
function olivadis_format_recipe($post) {
    $post_id = $post->ID;

    // Get featured image
    $featured_image = null;
    if (has_post_thumbnail($post_id)) {
        $image_id = get_post_thumbnail_id($post_id);
        $image = wp_get_attachment_image_src($image_id, 'full');
        $featured_image = array(
            'id' => $image_id,
            'src' => $image[0],
            'width' => $image[1],
            'height' => $image[2],
            'alt' => get_post_meta($image_id, '_wp_attachment_image_alt', true),
        );
    }

    // Get categories
    $categories = wp_get_post_terms($post_id, 'rezept_kategorie');
    $category_data = array();
    foreach ($categories as $category) {
        $category_data[] = array(
            'id' => $category->term_id,
            'name' => $category->name,
            'slug' => $category->slug,
        );
    }

    // Get ACF fields
    $prep_time = get_field('prep_time', $post_id);
    $difficulty = get_field('difficulty', $post_id);
    $servings = get_field('servings', $post_id);
    $ingredients = get_field('ingredients', $post_id);
    $instructions = get_field('instructions', $post_id);
    $cooks_note = get_field('cooks_note', $post_id);
    $nutritional_info = get_field('nutritional_info', $post_id);
    $video_url = get_field('video_url', $post_id);

    return array(
        'id' => $post_id,
        'title' => get_the_title($post_id),
        'slug' => $post->post_name,
        'content' => apply_filters('the_content', $post->post_content),
        'excerpt' => get_the_excerpt($post_id),
        'date' => get_the_date('c', $post_id),
        'modified' => get_the_modified_date('c', $post_id),
        'featured_image' => $featured_image,
        'categories' => $category_data,
        'prep_time' => $prep_time,
        'difficulty' => $difficulty,
        'servings' => $servings,
        'ingredients' => $ingredients,
        'instructions' => $instructions,
        'cooks_note' => $cooks_note,
        'nutritional_info' => $nutritional_info,
        'video_url' => $video_url,
    );
}
