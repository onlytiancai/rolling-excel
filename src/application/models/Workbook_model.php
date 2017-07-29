<?php
class Workbook_model extends CI_Model 
{

    public function __construct()
    {
        $this->load->database();
    }

    public function get_all($limit=100, $offset=0)
    {
        $this->db->select('uuid,title,created_time,changed_time')
            ->from('workbooks') 
            ->where(array('user_id' => $this->session->user_id))
            ->order_by('changed_time', 'desc')
            ->limit($limit, $offset);

        return $this->db->get()->result_array();
    }

    public function get($id)
    {
        $this->db->select('*')->from('workbooks')
            ->where(array('uuid' => $id))
            ->limit(1);
        return $this->db->get()->row_array();
    }

    public function delete($id)
    {
        $this->db->where(array('uuid' => $id));
        $ret = $this->db->delete('workbooks');
        if ($ret === false) throw new Exception('db server');
        return $ret;
    }

    public function create($data)
    {
        $id = gen_uuid(); 
        $data['user_id'] = $this->session->user_id;
        $data['created_time'] = date('Y-m-d H:i:s');
        $data['changed_time'] = date('Y-m-d H:i:s');
        $data['uuid'] = $id;

        $ret = $this->db->insert('workbooks', $data);
        if ($ret === false) throw new Exception('db server');
        return $id;
    }

    public function modify($id, $data)
    {
       $data['changed_time'] = date('Y-m-d H:i:s');

       $this->db->where('uuid', $id)->where('user_id', $this->session->user_id);
       $ret = $this->db->update('workbooks', $data); 
       if ($ret === false) throw new Exception('db server');
       return $ret;
    }

}
