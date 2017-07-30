<!DOCTYPE html>
<html lang="zh-CN">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="">
        <meta name="author" content="">
        <title>Rolling Excel</title>
        <link href="/static/lib/bootstrap/css/bootstrap.min.css" rel="stylesheet">
        <link href="/static/css/dashboard.css" rel="stylesheet">
    </head>
    <body>
        <nav class="navbar navbar-inverse navbar-fixed-top">
        <div class="container-fluid">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="#">Rolling Excel</a>
            </div>
            <div id="navbar" class="collapse navbar-collapse">
                <ul class="nav navbar-nav">
                    <?php foreach ($topnav as $item):?>
                    <?php 
                    echo "<li ";
                    if (isset($item['active'])) echo "class=\"active\"";
                    echo "><a href=\"{$item['link']}\">{$item['text']}</a></li>";
                    ?>
                    <?php endforeach;?>
                </ul>
                <p class="navbar-text navbar-right"><?php echo $this->session->oa_rtx ?> <a href="/logout">退出 </a></p>
            </div><!--/.nav-collapse -->
        </div>
        </nav>

        <div class="container-fluid">
            <div class="row">
                <div class="col-sm-3 col-md-2 sidebar">
                    <ul class="nav nav-sidebar">
                    <?php foreach ($leftnav as $item):?>
                    <?php 
                    echo "<li ";
                    if (isset($item['active'])) echo "class=\"active\"";
                    echo "><a href=\"{$item['link']}\">{$item['text']}</a></li>";
                    ?>
                    <?php endforeach;?>
                    </ul>
                </div>
                <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
