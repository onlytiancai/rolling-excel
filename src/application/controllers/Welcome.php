<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Welcome extends MY_Controller {

	public function index()
	{
        $this->load->view('header', $this->get_view_data('首页', '首页'));
        $this->load->view('index');
        $this->load->view('footer');
	}
}
