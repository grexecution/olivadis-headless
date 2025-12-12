<?php
/**
 * Admin Settings Page
 *
 * @package Olivadis_Headless_Integration
 */

class Olivadis_Admin_Settings {

    /**
     * Constructor
     */
    public function __construct() {
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'register_settings'));
        add_action('admin_notices', array($this, 'show_admin_notices'));
    }

    /**
     * Add admin menu
     */
    public function add_admin_menu() {
        add_options_page(
            'Olivadis Headless Settings',
            'Olivadis Headless',
            'manage_options',
            'olivadis-headless',
            array($this, 'render_settings_page')
        );
    }

    /**
     * Register settings
     */
    public function register_settings() {
        // Register settings
        register_setting('olivadis_headless_settings', 'olivadis_nextjs_url', array(
            'type' => 'string',
            'sanitize_callback' => array($this, 'sanitize_url'),
            'default' => '',
        ));

        register_setting('olivadis_headless_settings', 'olivadis_revalidation_secret', array(
            'type' => 'string',
            'sanitize_callback' => 'sanitize_text_field',
            'default' => '',
        ));

        register_setting('olivadis_headless_settings', 'olivadis_vercel_deploy_hook', array(
            'type' => 'string',
            'sanitize_callback' => array($this, 'sanitize_url'),
            'default' => '',
        ));

        // Add settings section
        add_settings_section(
            'olivadis_headless_main',
            'Next.js Integration Settings',
            array($this, 'render_settings_section'),
            'olivadis-headless'
        );

        // Add settings fields
        add_settings_field(
            'olivadis_nextjs_url',
            'Next.js Site URL',
            array($this, 'render_nextjs_url_field'),
            'olivadis-headless',
            'olivadis_headless_main'
        );

        add_settings_field(
            'olivadis_revalidation_secret',
            'Revalidation Secret Key',
            array($this, 'render_secret_key_field'),
            'olivadis-headless',
            'olivadis_headless_main'
        );

        add_settings_field(
            'olivadis_vercel_deploy_hook',
            'Vercel Deploy Hook URL',
            array($this, 'render_deploy_hook_field'),
            'olivadis-headless',
            'olivadis_headless_main'
        );
    }

    /**
     * Sanitize URL
     */
    public function sanitize_url($url) {
        $url = esc_url_raw($url);
        return untrailingslashit($url);
    }

    /**
     * Render settings section
     */
    public function render_settings_section() {
        echo '<p>Configure your Next.js headless frontend integration. These settings enable automatic revalidation when recipes or products are updated.</p>';
    }

    /**
     * Render Next.js URL field
     */
    public function render_nextjs_url_field() {
        $value = get_option('olivadis_nextjs_url', '');
        ?>
        <input type="url" name="olivadis_nextjs_url" id="olivadis_nextjs_url" value="<?php echo esc_attr($value); ?>" class="regular-text" placeholder="https://your-site.vercel.app">
        <p class="description">Enter your Next.js site URL (without trailing slash). Example: <code>https://olivadis-headless.vercel.app</code></p>
        <?php
    }

    /**
     * Render secret key field
     */
    public function render_secret_key_field() {
        $value = get_option('olivadis_revalidation_secret', '');
        ?>
        <input type="text" name="olivadis_revalidation_secret" id="olivadis_revalidation_secret" value="<?php echo esc_attr($value); ?>" class="regular-text" placeholder="your-secret-key">
        <p class="description">Enter a secret key for webhook authentication. This should match the <code>REVALIDATION_SECRET</code> environment variable in your Next.js app.</p>
        <button type="button" class="button button-secondary" onclick="document.getElementById('olivadis_revalidation_secret').value = '<?php echo esc_js(wp_generate_password(32, false)); ?>'">Generate Random Key</button>
        <?php
    }

    /**
     * Render Vercel Deploy Hook URL field
     */
    public function render_deploy_hook_field() {
        $value = get_option('olivadis_vercel_deploy_hook', '');
        ?>
        <input type="url" name="olivadis_vercel_deploy_hook" id="olivadis_vercel_deploy_hook" value="<?php echo esc_attr($value); ?>" class="large-text" placeholder="https://api.vercel.com/v1/integrations/deploy/...">
        <p class="description">
            <strong>Optional:</strong> Enter your Vercel Deploy Hook URL to automatically rebuild your site when shipping settings change.<br>
            <strong>How to get this:</strong> In Vercel Dashboard → Settings → Git → Deploy Hooks → Create Hook → Copy URL<br>
            <strong>When used:</strong> Triggers rebuild when WooCommerce shipping zones, rates, or tax settings are updated.
        </p>
        <?php
    }

    /**
     * Render settings page
     */
    public function render_settings_page() {
        // Check user capabilities
        if (!current_user_can('manage_options')) {
            return;
        }

        // Handle manual revalidation
        if (isset($_POST['trigger_revalidation']) && check_admin_referer('olivadis_trigger_revalidation')) {
            $result = Olivadis_Revalidation_Hooks::trigger_full_revalidation();
            if (is_wp_error($result)) {
                add_settings_error(
                    'olivadis_headless_messages',
                    'olivadis_headless_error',
                    'Error: ' . $result->get_error_message(),
                    'error'
                );
            } else {
                add_settings_error(
                    'olivadis_headless_messages',
                    'olivadis_headless_success',
                    'Full site revalidation triggered successfully!',
                    'success'
                );
            }
        }

        // Get settings values
        $nextjs_url = get_option('olivadis_nextjs_url', '');
        $secret_key = get_option('olivadis_revalidation_secret', '');
        $is_configured = !empty($nextjs_url) && !empty($secret_key);
        ?>
        <div class="wrap">
            <h1><?php echo esc_html(get_admin_page_title()); ?></h1>

            <?php settings_errors('olivadis_headless_messages'); ?>

            <form action="options.php" method="post">
                <?php
                settings_fields('olivadis_headless_settings');
                do_settings_sections('olivadis-headless');
                submit_button('Save Settings');
                ?>
            </form>

            <hr>

            <h2>Status</h2>
            <table class="form-table">
                <tr>
                    <th scope="row">Configuration Status</th>
                    <td>
                        <?php if ($is_configured): ?>
                            <span style="color: green;">✓ Configured</span>
                        <?php else: ?>
                            <span style="color: orange;">⚠ Not Configured</span>
                        <?php endif; ?>
                    </td>
                </tr>
                <tr>
                    <th scope="row">Next.js URL</th>
                    <td>
                        <?php echo $nextjs_url ? '<code>' . esc_html($nextjs_url) . '</code>' : '<em>Not set</em>'; ?>
                    </td>
                </tr>
                <tr>
                    <th scope="row">Secret Key</th>
                    <td>
                        <?php echo $secret_key ? '<code>' . esc_html(substr($secret_key, 0, 8)) . '...</code>' : '<em>Not set</em>'; ?>
                    </td>
                </tr>
                <tr>
                    <th scope="row">Revalidation Endpoint</th>
                    <td>
                        <?php if ($nextjs_url): ?>
                            <code><?php echo esc_html($nextjs_url); ?>/api/revalidate</code>
                        <?php else: ?>
                            <em>Configure Next.js URL first</em>
                        <?php endif; ?>
                    </td>
                </tr>
            </table>

            <hr>

            <h2>Manual Revalidation</h2>
            <p>Trigger a full site revalidation to update all pages on your Next.js frontend.</p>
            <form method="post">
                <?php wp_nonce_field('olivadis_trigger_revalidation'); ?>
                <button type="submit" name="trigger_revalidation" class="button button-primary" <?php echo !$is_configured ? 'disabled' : ''; ?>>
                    Trigger Full Site Revalidation
                </button>
            </form>

            <hr>

            <h2>Automatic Revalidation Events</h2>
            <p>The following events will automatically trigger revalidation on your Next.js site:</p>
            <ul style="list-style: disc; margin-left: 20px;">
                <li><strong>Recipes:</strong> Create, Update, Delete, Trash</li>
                <li><strong>Recipe Categories:</strong> Create, Update, Delete</li>
                <li><strong>Products:</strong> Create, Update, Delete, Trash, Stock Change</li>
                <li><strong>Product Variations:</strong> Create, Update, Delete</li>
                <li><strong>Product Categories:</strong> Create, Update, Delete</li>
            </ul>

            <hr>

            <h2>Setup Instructions</h2>
            <ol style="margin-left: 20px;">
                <li>
                    <strong>Install Advanced Custom Fields (ACF) Plugin</strong><br>
                    <small>This plugin requires ACF to manage recipe fields. Install it from the WordPress plugin directory.</small>
                </li>
                <li>
                    <strong>Generate a Secret Key</strong><br>
                    <small>Click the "Generate Random Key" button above to create a secure secret key.</small>
                </li>
                <li>
                    <strong>Add Environment Variable to Next.js</strong><br>
                    <small>Add the following to your <code>.env.local</code> file in your Next.js project:</small>
                    <pre style="background: #f5f5f5; padding: 10px; margin: 10px 0;">REVALIDATION_SECRET=your-secret-key-here</pre>
                </li>
                <li>
                    <strong>Enter Your Next.js URL</strong><br>
                    <small>Enter your production or staging Next.js URL in the settings above.</small>
                </li>
                <li>
                    <strong>Save Settings</strong><br>
                    <small>Click "Save Settings" to activate the integration.</small>
                </li>
                <li>
                    <strong>Test the Integration</strong><br>
                    <small>Create or update a recipe and verify that your Next.js site updates automatically.</small>
                </li>
            </ol>

            <hr>

            <h2>REST API Endpoints</h2>
            <p>The following REST API endpoints are available for recipes:</p>
            <ul style="list-style: disc; margin-left: 20px;">
                <li><code><?php echo rest_url('olivadis/v1/recipes'); ?></code> - Get all recipes</li>
                <li><code><?php echo rest_url('olivadis/v1/recipes/{slug}'); ?></code> - Get single recipe by slug</li>
                <li><code><?php echo rest_url('olivadis/v1/recipe-categories'); ?></code> - Get recipe categories</li>
            </ul>
        </div>
        <?php
    }

    /**
     * Show admin notices
     */
    public function show_admin_notices() {
        // Check if ACF is installed
        if (!function_exists('acf_add_local_field_group')) {
            ?>
            <div class="notice notice-warning">
                <p>
                    <strong>Olivadis Headless Integration:</strong>
                    This plugin requires Advanced Custom Fields (ACF) to be installed and activated.
                    <a href="<?php echo admin_url('plugin-install.php?s=advanced+custom+fields&tab=search&type=term'); ?>">Install ACF now</a>
                </p>
            </div>
            <?php
        }

        // Check if settings are configured
        $nextjs_url = get_option('olivadis_nextjs_url', '');
        $secret_key = get_option('olivadis_revalidation_secret', '');

        if ((empty($nextjs_url) || empty($secret_key)) && isset($_GET['page']) && $_GET['page'] !== 'olivadis-headless') {
            ?>
            <div class="notice notice-info is-dismissible">
                <p>
                    <strong>Olivadis Headless Integration:</strong>
                    Please configure your Next.js integration settings.
                    <a href="<?php echo admin_url('options-general.php?page=olivadis-headless'); ?>">Configure now</a>
                </p>
            </div>
            <?php
        }
    }
}
