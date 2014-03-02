<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class MY_Controller extends CI_Controller {

	/*
	 * Code executé tout le temps
	 */
	public function __construct()
	{
		parent::__construct();

		// On charge notre library de gestion de vue
		$this->load->library('layout');

		// On défini un titre par défaut 
		$this->layout->set_title(' | Afinedoc.com');

		$config['charset'] = 'utf-8';

	}

}