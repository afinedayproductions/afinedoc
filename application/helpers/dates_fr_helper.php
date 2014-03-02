<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
 
if ( ! function_exists('date_mysql_to_fr'))
{
    function date_mysql_to_fr($date, $delimiter = '-')
    {
        $dateFR = explode($delimiter, $date);
        return $dateFR[2] . "/" . $dateFR[1] . "/" . $dateFR[0]; 
    }
}