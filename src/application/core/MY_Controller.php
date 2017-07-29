<?php
class MY_Controller extends CI_Controller {

    public function __construct()
    {
        parent::__construct();
        $this->session->set_userdata('user_id', 1); //TODO: for test
    }
    /**
     * 获取菜单数据
     * */
    protected function get_view_data($top_name, $left_name)
    {
        $navconfig = $this->config->item('navconfig');

        $ret = array('topnav' => array(), 'leftnav' => array() );

        foreach ($navconfig as $item) {
            if ($item['text'] == $top_name) {
                $ret['leftnav'] = $item['leftnav'];
            }
            unset($item['leftnav']);
            $ret['topnav'][] = $item;
        }

        foreach ($ret['topnav'] as &$item) {
            if ($item['text'] == $top_name) {
                $item['active'] = true;
            }
        }

        foreach ($ret['leftnav'] as &$item) {
            if ($item['text'] == $left_name) {
                $item['active'] = true;
            }
        }

        return $ret;
    } 

    protected function put_json($data)
    {
        $this->output ->set_content_type('application/json');
        $this->output->set_output(json_encode($data)); 
    }

    protected function request_json()
    {
       $stream_clean = $this->security->xss_clean($this->input->raw_input_stream);
       return json_decode($stream_clean, true); 
    }
}
