<?php
/**
 * Shipping Settings Hooks
 *
 * Triggers Vercel rebuild when WooCommerce shipping settings change
 *
 * @package Olivadis_Headless_Integration
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Olivadis_Shipping_Hooks {

	/**
	 * Initialize hooks
	 */
	public static function init() {
		// Trigger rebuild when shipping zones are updated
		add_action( 'woocommerce_shipping_zone_method_added', array( __CLASS__, 'trigger_rebuild' ), 10, 3 );
		add_action( 'woocommerce_shipping_zone_method_updated', array( __CLASS__, 'trigger_rebuild' ), 10, 3 );
		add_action( 'woocommerce_shipping_zone_method_deleted', array( __CLASS__, 'trigger_rebuild' ), 10, 3 );
		add_action( 'woocommerce_shipping_zone_method_status_toggled', array( __CLASS__, 'trigger_rebuild' ), 10, 4 );

		// Trigger rebuild when tax rates are updated
		add_action( 'woocommerce_tax_rate_added', array( __CLASS__, 'trigger_rebuild' ) );
		add_action( 'woocommerce_tax_rate_updated', array( __CLASS__, 'trigger_rebuild' ) );
		add_action( 'woocommerce_tax_rate_deleted', array( __CLASS__, 'trigger_rebuild' ) );
	}

	/**
	 * Trigger Vercel rebuild
	 *
	 * This will rebuild your Next.js site with updated shipping rules
	 */
	public static function trigger_rebuild() {
		$vercel_deploy_hook = get_option( 'olivadis_vercel_deploy_hook' );

		if ( empty( $vercel_deploy_hook ) ) {
			error_log( 'Olivadis Headless: Vercel Deploy Hook URL not configured. Shipping rules will not sync until next manual deployment.' );
			return;
		}

		$response = wp_remote_post( $vercel_deploy_hook, array(
			'timeout' => 5,
			'blocking' => false, // Don't wait for response
		) );

		if ( is_wp_error( $response ) ) {
			error_log( 'Olivadis Headless: Failed to trigger Vercel rebuild: ' . $response->get_error_message() );
		} else {
			error_log( 'Olivadis Headless: Vercel rebuild triggered due to shipping settings change' );
		}
	}
}
