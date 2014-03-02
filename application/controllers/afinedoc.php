<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Afinedoc extends MY_Controller {

	public function __construct() {
		parent::__construct();
		$this->load->library('layout');
	}

	public function index() {

		// Define page title
		$this->layout->set_second_part_title('My own documentation');

		//! SET VIEWS
		//$this->layout->view('article');
		$this->layout->view('void');
		//! END SET VIEWS

	}
}

/* End of file afinedoc.php */
/* Location: ./application/controllers/afinedoc.php */