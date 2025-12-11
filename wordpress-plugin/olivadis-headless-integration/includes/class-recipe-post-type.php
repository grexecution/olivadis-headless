<?php
/**
 * Register Recipe Custom Post Type
 *
 * @package Olivadis_Headless_Integration
 */

class Olivadis_Recipe_Post_Type {

    /**
     * Constructor
     */
    public function __construct() {
        add_action('init', array($this, 'register_post_type'));
        add_action('init', array($this, 'register_taxonomy'));
    }

    /**
     * Register the 'rezepte' post type
     */
    public function register_post_type() {
        $labels = array(
            'name'                  => _x('Rezepte', 'Post type general name', 'olivadis-headless'),
            'singular_name'         => _x('Rezept', 'Post type singular name', 'olivadis-headless'),
            'menu_name'             => _x('Rezepte', 'Admin Menu text', 'olivadis-headless'),
            'name_admin_bar'        => _x('Rezept', 'Add New on Toolbar', 'olivadis-headless'),
            'add_new'               => __('Neu hinzufügen', 'olivadis-headless'),
            'add_new_item'          => __('Neues Rezept hinzufügen', 'olivadis-headless'),
            'new_item'              => __('Neues Rezept', 'olivadis-headless'),
            'edit_item'             => __('Rezept bearbeiten', 'olivadis-headless'),
            'view_item'             => __('Rezept ansehen', 'olivadis-headless'),
            'all_items'             => __('Alle Rezepte', 'olivadis-headless'),
            'search_items'          => __('Rezepte suchen', 'olivadis-headless'),
            'parent_item_colon'     => __('Übergeordnete Rezepte:', 'olivadis-headless'),
            'not_found'             => __('Keine Rezepte gefunden.', 'olivadis-headless'),
            'not_found_in_trash'    => __('Keine Rezepte im Papierkorb gefunden.', 'olivadis-headless'),
            'featured_image'        => _x('Rezept Bild', 'Overrides the "Featured Image" phrase', 'olivadis-headless'),
            'set_featured_image'    => _x('Rezept Bild festlegen', 'Overrides the "Set featured image" phrase', 'olivadis-headless'),
            'remove_featured_image' => _x('Rezept Bild entfernen', 'Overrides the "Remove featured image" phrase', 'olivadis-headless'),
            'use_featured_image'    => _x('Als Rezept Bild verwenden', 'Overrides the "Use as featured image" phrase', 'olivadis-headless'),
            'archives'              => _x('Rezept Archiv', 'The post type archive label used in nav menus', 'olivadis-headless'),
            'insert_into_item'      => _x('In Rezept einfügen', 'Overrides the "Insert into post" phrase', 'olivadis-headless'),
            'uploaded_to_this_item' => _x('Zu diesem Rezept hochgeladen', 'Overrides the "Uploaded to this post" phrase', 'olivadis-headless'),
            'filter_items_list'     => _x('Rezepte Liste filtern', 'Screen reader text for the filter links', 'olivadis-headless'),
            'items_list_navigation' => _x('Rezepte Listen Navigation', 'Screen reader text for the pagination', 'olivadis-headless'),
            'items_list'            => _x('Rezepte Liste', 'Screen reader text for the items list', 'olivadis-headless'),
        );

        $args = array(
            'labels'             => $labels,
            'public'             => true,
            'publicly_queryable' => true,
            'show_ui'            => true,
            'show_in_menu'       => true,
            'query_var'          => true,
            'rewrite'            => array('slug' => 'rezepte'),
            'capability_type'    => 'post',
            'has_archive'        => true,
            'hierarchical'       => false,
            'menu_position'      => 20,
            'menu_icon'          => 'dashicons-carrot',
            'show_in_rest'       => true, // Enable Gutenberg editor
            'rest_base'          => 'rezepte',
            'supports'           => array('title', 'editor', 'thumbnail', 'excerpt', 'revisions'),
        );

        register_post_type('rezepte', $args);
    }

    /**
     * Register the recipe category taxonomy
     */
    public function register_taxonomy() {
        $labels = array(
            'name'                       => _x('Rezept Kategorien', 'taxonomy general name', 'olivadis-headless'),
            'singular_name'              => _x('Rezept Kategorie', 'taxonomy singular name', 'olivadis-headless'),
            'search_items'               => __('Kategorien suchen', 'olivadis-headless'),
            'popular_items'              => __('Beliebte Kategorien', 'olivadis-headless'),
            'all_items'                  => __('Alle Kategorien', 'olivadis-headless'),
            'parent_item'                => __('Übergeordnete Kategorie', 'olivadis-headless'),
            'parent_item_colon'          => __('Übergeordnete Kategorie:', 'olivadis-headless'),
            'edit_item'                  => __('Kategorie bearbeiten', 'olivadis-headless'),
            'update_item'                => __('Kategorie aktualisieren', 'olivadis-headless'),
            'add_new_item'               => __('Neue Kategorie hinzufügen', 'olivadis-headless'),
            'new_item_name'              => __('Neuer Kategoriename', 'olivadis-headless'),
            'separate_items_with_commas' => __('Kategorien mit Kommas trennen', 'olivadis-headless'),
            'add_or_remove_items'        => __('Kategorien hinzufügen oder entfernen', 'olivadis-headless'),
            'choose_from_most_used'      => __('Aus den am häufigsten verwendeten Kategorien auswählen', 'olivadis-headless'),
            'not_found'                  => __('Keine Kategorien gefunden.', 'olivadis-headless'),
            'menu_name'                  => __('Kategorien', 'olivadis-headless'),
        );

        $args = array(
            'hierarchical'          => true, // Like categories
            'labels'                => $labels,
            'show_ui'               => true,
            'show_admin_column'     => true,
            'show_in_rest'          => true,
            'query_var'             => true,
            'rewrite'               => array('slug' => 'rezept-kategorie'),
        );

        register_taxonomy('rezept_kategorie', array('rezepte'), $args);

        // Register default categories
        $this->register_default_categories();
    }

    /**
     * Register default recipe categories
     */
    private function register_default_categories() {
        $default_categories = array(
            'Aufstriche' => 'aufstriche',
            'Salate' => 'salate',
            'Dips' => 'dips',
            'Vorspeisen' => 'vorspeisen',
            'Hauptgerichte' => 'hauptgerichte',
            'Desserts' => 'desserts',
            'Snacks' => 'snacks',
        );

        foreach ($default_categories as $name => $slug) {
            if (!term_exists($slug, 'rezept_kategorie')) {
                wp_insert_term($name, 'rezept_kategorie', array('slug' => $slug));
            }
        }
    }
}
