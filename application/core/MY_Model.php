<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
 
// -----------------------------------------------------------------------------
 
class MY_Model extends CI_Model
{
    /**
     *  Insère une nouvelle ligne dans la base de données.
     */
    public function create($options_echappees = array(), $options_non_echappees = array())
    {
         // Vérification des données à insérer
        if(empty($options_echappees) AND empty($options_non_echappees))
        {
            return false;
        }
    
        return (bool) $this->db->set($options_echappees)
                               ->set($options_non_echappees, null, false)
                               ->insert($this->table);
    }
 
    /**
     *  Récupère des données dans la base de données.
     */
    public function read($select = '*', $where = array(), $nb = null, $debut = null)
    {
        return $this->db->select($select)
                    ->from($this->table)
                    ->where($where)
                    ->get()
                    ->result();
    }

    public function read_distinct($select = '*', $where = array(), $nb = null, $debut = null)
    {
        return $this->db->select($select)
                    ->from($this->table)
                    ->where($where)
                    ->distinct()
                    ->get()
                    ->result();
    }

    public function read_or($select = '*', $where = array(), $or_where = array(), $nb = null, $debut = null)
    {
        return $this->db->select($select)
                    ->from($this->table)
                    ->where($where)
                    ->or_where($or_where)
                    ->get()
                    ->result();
    }
     
    /**
     *  Modifie une ou plusieurs lignes dans la base de données.
     */
    public function update($where, $options_echappees = array(), $options_non_echappees)
    {      
         // Vérification des données à mettre à jour
        if(empty($options_echappees) AND empty($options_non_echappees))
        {
            return false;
        }
        
        //  Raccourci dans le cas où on sélectionne l'id
        if(is_integer($where))
        {
            $where = array('id' => $where);
        }

        return (bool) $this->db->set($options_echappees)
                               ->set($options_non_echappees, null, false)
                               ->where($where)
                               ->update($this->table);
    }
     
    /**
     *  Supprime une ou plusieurs lignes de la base de données.
     */
    public function delete($where)
    {
        if(is_integer($where)){
            $where = array('id' => $where);
        }
    
        return (bool) $this->db->where($where)
                               ->delete($this->table);
    }
 
    /**
     *  Retourne le nombre de résultats.
     */
    public function count($champ = array(), $valeur = null)
    {
        return (int) $this->db->where($champ, $valeur)
                              ->from($this->table)
                              ->count_all_results();
    }

    public function convert_jsDate_sqlDate($date)
    {
        $arrayDate = explode("/", $date);
        
        if( ! empty($arrayDate)) {
            $day   = $arrayDate[1];
            $month = $arrayDate[0];
            $year  = $arrayDate[2];

            $date = new DateTime($month.'/'.$day.'/'.$year);
            var_dump($date);// probleme : si on affiche pas la date, elle ne fonctionne pas !
            return $date;
        }
        return false;
    }

}
 
/* End of file MY_Model.php */
/* Location: ./system/application/core/MY_Model.php */