<?php
/**
 * Plugin Name:       WooCoor Cart
 * Description:       Example block scaffolded with Create Block tool.
 * Version:           0.1.0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       woocoor-cart
 *
 * @package Woocoor
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}
/**
 * Registers the block using a `blocks-manifest.php` file, which improves the performance of block type registration.
 * Behind the scenes, it also registers all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://make.wordpress.org/core/2025/03/13/more-efficient-block-type-registration-in-6-8/
 * @see https://make.wordpress.org/core/2024/10/17/new-block-type-registration-apis-to-improve-performance-in-wordpress-6-7/
 */
function woocoor_woocoor_cart_block_init() {
	/**
	 * Registers the block(s) metadata from the `blocks-manifest.php` and registers the block type(s)
	 * based on the registered block metadata.
	 * Added in WordPress 6.8 to simplify the block metadata registration process added in WordPress 6.7.
	 *
	 * @see https://make.wordpress.org/core/2025/03/13/more-efficient-block-type-registration-in-6-8/
	 */
	if ( function_exists( 'wp_register_block_types_from_metadata_collection' ) ) {
		wp_register_block_types_from_metadata_collection( __DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php' );
		return;
	}

	/**
	 * Registers the block(s) metadata from the `blocks-manifest.php` file.
	 * Added to WordPress 6.7 to improve the performance of block type registration.
	 *
	 * @see https://make.wordpress.org/core/2024/10/17/new-block-type-registration-apis-to-improve-performance-in-wordpress-6-7/
	 */
	if ( function_exists( 'wp_register_block_metadata_collection' ) ) {
		wp_register_block_metadata_collection( __DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php' );
	}
	/**
	 * Registers the block type(s) in the `blocks-manifest.php` file.
	 *
	 * @see https://developer.wordpress.org/reference/functions/register_block_type/
	 */
	$manifest_data = require __DIR__ . '/build/blocks-manifest.php';
	foreach ( array_keys( $manifest_data ) as $block_type ) {
		register_block_type( __DIR__ . "/build/{$block_type}" );
	}
}
add_action( 'init', 'woocoor_woocoor_cart_block_init' );

// REST API initialization.
add_action('rest_api_init', function() {
    register_rest_route('woocoor/v1', '/cart-items', [
        'methods' => 'GET',
        'callback' => 'woocoor_get_cart_items',
        'permission_callback' => '__return_true',
    ]);
});

// Callback function to load cart items.
function woocoor_get_cart_items(WP_REST_Request $request) {
	$json_file_path = plugin_dir_path(__FILE__) . 'samples/cart-items.json';
    if (file_exists($json_file_path) && is_readable($json_file_path)) {
        $json_data = file_get_contents($json_file_path);
        $cart_data = json_decode($json_data, true);
        if ($cart_data !== null) {
            return rest_ensure_response($cart_data);
        } else {
            return new WP_Error('invalid_json', 'Error decoding JSON data', ['status' => 500]);
        }
    } else {
        return new WP_Error('file_not_found', 'Sample data file not found', ['status' => 404]);
    }
}