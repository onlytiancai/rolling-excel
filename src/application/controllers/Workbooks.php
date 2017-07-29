<?php
class Workbooks extends MY_Controller {

    public function __construct()
    {
        parent::__construct();
        $this->load->model('workbook_model');
    }

	public function index($id=null)
    {
        switch ($this->input->method()) {
        case 'get' :
            if (!$id) {
                return $this->_get_all();
            } else {
                return $this->_get($id);
            }
            break;
        case 'post':
            return $this->_create();
            break;
        case 'put':
            return $this->_modify($id);
            break;
        case 'delete':
            return $this->_delete($id);
            break;
        default:
            throw new InvalidArgumentException('Unknow http method.');
        }
    }

    private function _get_all()
    {
        $limit = $this->input->post_get('limit', true);
        $offset = $this->input->post_get('offset', true);
        return $this->put_json($this->workbook_model->get_all($limit, $offset)); 
    }

    private function _delete($id)
    {
        //TODO: 权限检查
        $ret = $this->workbook_model->delete($id);
        return $this->put_json(array('result' => $ret)); 
    }


    private function _get($id)
    {
        $ret = $this->workbook_model->get($id);
        //TODO: 权限检查
        return $this->put_json($ret); 
    }

    private function _create()
    {
        $req = $this->request_json();
        $id = $this->workbook_model->create($req);
        return $this->_get($id); 
    }

    private function _modify($id)
    {
        $req = $this->request_json();
        $ret = $this->workbook_model->modify($id, $req);
        $this->put_json(array('result' => $ret)); 
    }
}
