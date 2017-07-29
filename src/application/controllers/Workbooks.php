<?php
class Workbooks extends MY_Controller {

    public function __contruct()
    {
    }

	public function index()
    {
        if ($this->input->method() == 'get') {
            $this->put_json(array(
                array('title' => '1111'),
                array('title' => '2222'),
                array('title' => '3333'),
            )); 
        } else {
            $this->put_json(array(
                'id' => 5,
                'title' => '555',
            )); 
        }
	}
}
