<?php if (!defined('BASEPATH')) exit('No direct script access allowed');
 
class Layout
{
    private $CI;
    private $var = array();
     
/*
|===============================================================================
| Constructeur
|===============================================================================
*/
     
    public function __construct()
    {
        $this->CI = get_instance();
             
        $this->var['output'] = '';
         
        //  Le titre est composé du nom de la méthode et du nom du contrôleur
        //  La fonction ucfirst permet d'ajouter une majuscule
        $this->var['title'] = ucfirst($this->CI->router->fetch_method()) . ' - ' . ucfirst($this->CI->router->fetch_class());
        $this->var['second_part_title'] = "";
        
        //  Nous initialisons la variable $charset avec la même valeur que
        //  la clé de configuration initialisée dans le fichier config.php
        $this->var['charset'] = $this->CI->config->item('charset');

        $this->var['css'] = array();
        $this->var['js']  = array();
    }
     
/*
|===============================================================================
| Méthodes pour charger les vues
|   . view
|   . views
|===============================================================================
*/
     
    public function view($name, $data = array())
    {
        $this->var['output'] .= $this->CI->load->view($name, $data, true);
         
        $this->CI->load->view('../theme/theme', $this->var);
    }
     
    public function views($name, $data = array())
    {
        $this->var['output'] .= $this->CI->load->view($name, $data, true);
        return $this;
    }

/*
|===============================================================================
| Méthodes pour modifier les variables envoyées au layout
|===============================================================================
*/
    
    public function set_title($title)
    {
        if(is_string($title) AND !empty($title))
        {
            $this->var['title'] = $title;
            return true;
        }
        return false;
    }

    public function set_second_part_title($second_part_title)
    {
        if(is_string($second_part_title) AND !empty($second_part_title))
        {
            $this->var['second_part_title'] = $second_part_title;
            return true;
        }
        return false;
    }
     
    public function set_charset($charset)
    {
        if(is_string($charset) AND !empty($charset))
        {
            $this->var['charset'] = $charset;
            return true;
        }
        return false;
    }

/*
|===============================================================================
| Méthodes pour ajouter des feuilles de CSS et de JavaScript
|===============================================================================
*/
    public function add_css($name)
    {
        if(is_string($name) AND !empty($name) AND file_exists('./assets/css/' . $name . '.css'))
        {
            $this->var['css'][] = css_url($name);
            return true;
        }
        return false;
    }
     
    public function add_js($name)
    {
        if(is_string($name) AND !empty($name) AND file_exists('./assets/js/' . $name . '.js'))
        {
            $this->var['js'][] = js_url($name);
            return true;
        }
        return false;
    }
}