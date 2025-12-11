<?php
/**
 * Register Recipe ACF Fields
 *
 * @package Olivadis_Headless_Integration
 */

class Olivadis_Recipe_Fields {

    /**
     * Constructor
     */
    public function __construct() {
        add_action('acf/init', array($this, 'register_recipe_fields'));
    }

    /**
     * Register ACF fields for recipes
     */
    public function register_recipe_fields() {
        // Check if ACF function exists
        if (!function_exists('acf_add_local_field_group')) {
            return;
        }

        acf_add_local_field_group(array(
            'key' => 'group_recipe_details',
            'title' => 'Rezept Details',
            'fields' => array(
                // Prep Time
                array(
                    'key' => 'field_prep_time',
                    'label' => 'Zubereitungszeit',
                    'name' => 'prep_time',
                    'type' => 'text',
                    'instructions' => 'z.B. "5 Minuten", "30 Minuten", "1 Stunde"',
                    'required' => 1,
                    'placeholder' => '5 Minuten',
                ),
                // Difficulty Level
                array(
                    'key' => 'field_difficulty',
                    'label' => 'Schwierigkeitsgrad',
                    'name' => 'difficulty',
                    'type' => 'select',
                    'instructions' => 'Wählen Sie den Schwierigkeitsgrad',
                    'required' => 1,
                    'choices' => array(
                        'Sehr leicht' => 'Sehr leicht',
                        'Leicht' => 'Leicht',
                        'Mittel' => 'Mittel',
                        'Schwer' => 'Schwer',
                    ),
                    'default_value' => 'Leicht',
                    'allow_null' => 0,
                    'ui' => 1,
                ),
                // Servings
                array(
                    'key' => 'field_servings',
                    'label' => 'Portionen',
                    'name' => 'servings',
                    'type' => 'number',
                    'instructions' => 'Anzahl der Portionen',
                    'required' => 1,
                    'default_value' => 4,
                    'min' => 1,
                    'max' => 50,
                    'step' => 1,
                ),
                // Ingredients (Repeater)
                array(
                    'key' => 'field_ingredients',
                    'label' => 'Zutaten',
                    'name' => 'ingredients',
                    'type' => 'repeater',
                    'instructions' => 'Fügen Sie alle Zutaten hinzu',
                    'required' => 1,
                    'layout' => 'table',
                    'button_label' => 'Zutat hinzufügen',
                    'sub_fields' => array(
                        array(
                            'key' => 'field_ingredient_amount',
                            'label' => 'Menge',
                            'name' => 'amount',
                            'type' => 'text',
                            'instructions' => 'z.B. "100g", "2 EL", "1 Prise"',
                            'required' => 0,
                            'placeholder' => '100g',
                        ),
                        array(
                            'key' => 'field_ingredient_name',
                            'label' => 'Zutat',
                            'name' => 'name',
                            'type' => 'text',
                            'instructions' => '',
                            'required' => 1,
                            'placeholder' => 'Olivenöl',
                        ),
                    ),
                ),
                // Instructions (Repeater)
                array(
                    'key' => 'field_instructions',
                    'label' => 'Zubereitungsschritte',
                    'name' => 'instructions',
                    'type' => 'repeater',
                    'instructions' => 'Fügen Sie die Zubereitungsschritte hinzu',
                    'required' => 1,
                    'layout' => 'row',
                    'button_label' => 'Schritt hinzufügen',
                    'sub_fields' => array(
                        array(
                            'key' => 'field_instruction_step',
                            'label' => 'Schritt',
                            'name' => 'step',
                            'type' => 'textarea',
                            'instructions' => 'Beschreiben Sie den Zubereitungsschritt',
                            'required' => 1,
                            'rows' => 3,
                        ),
                    ),
                ),
                // Cook's Note
                array(
                    'key' => 'field_cooks_note',
                    'label' => 'Koch-Notiz',
                    'name' => 'cooks_note',
                    'type' => 'textarea',
                    'instructions' => 'Optionale Tipps oder Hinweise zum Rezept',
                    'required' => 0,
                    'rows' => 4,
                    'placeholder' => 'Tipp: Verwenden Sie frisches Extra Virgin Olivenöl für den besten Geschmack.',
                ),
                // Nutritional Information (Group)
                array(
                    'key' => 'field_nutritional_info',
                    'label' => 'Nährwertangaben (pro Portion)',
                    'name' => 'nutritional_info',
                    'type' => 'group',
                    'instructions' => 'Optionale Nährwertangaben',
                    'required' => 0,
                    'layout' => 'block',
                    'sub_fields' => array(
                        array(
                            'key' => 'field_calories',
                            'label' => 'Kalorien (kcal)',
                            'name' => 'calories',
                            'type' => 'number',
                            'required' => 0,
                            'placeholder' => '250',
                        ),
                        array(
                            'key' => 'field_protein',
                            'label' => 'Eiweiß (g)',
                            'name' => 'protein',
                            'type' => 'number',
                            'required' => 0,
                            'placeholder' => '10',
                        ),
                        array(
                            'key' => 'field_carbs',
                            'label' => 'Kohlenhydrate (g)',
                            'name' => 'carbs',
                            'type' => 'number',
                            'required' => 0,
                            'placeholder' => '30',
                        ),
                        array(
                            'key' => 'field_fat',
                            'label' => 'Fett (g)',
                            'name' => 'fat',
                            'type' => 'number',
                            'required' => 0,
                            'placeholder' => '15',
                        ),
                        array(
                            'key' => 'field_fiber',
                            'label' => 'Ballaststoffe (g)',
                            'name' => 'fiber',
                            'type' => 'number',
                            'required' => 0,
                            'placeholder' => '5',
                        ),
                    ),
                ),
                // Video URL
                array(
                    'key' => 'field_video_url',
                    'label' => 'Video URL',
                    'name' => 'video_url',
                    'type' => 'url',
                    'instructions' => 'Optional: YouTube oder Vimeo Video URL',
                    'required' => 0,
                    'placeholder' => 'https://www.youtube.com/watch?v=...',
                ),
                // Locked for Premium Users
                array(
                    'key' => 'field_locked',
                    'label' => 'Nur für Kunden',
                    'name' => 'locked',
                    'type' => 'true_false',
                    'instructions' => 'Aktivieren Sie dies, um das Rezept nur für registrierte Kunden sichtbar zu machen',
                    'required' => 0,
                    'message' => 'Dieses Rezept ist nur für Kunden verfügbar',
                    'default_value' => 0,
                    'ui' => 1,
                    'ui_on_text' => 'Gesperrt',
                    'ui_off_text' => 'Öffentlich',
                ),
            ),
            'location' => array(
                array(
                    array(
                        'param' => 'post_type',
                        'operator' => '==',
                        'value' => 'rezepte',
                    ),
                ),
            ),
            'menu_order' => 0,
            'position' => 'normal',
            'style' => 'default',
            'label_placement' => 'top',
            'instruction_placement' => 'label',
            'hide_on_screen' => array(),
            'active' => true,
            'description' => '',
        ));
    }
}
