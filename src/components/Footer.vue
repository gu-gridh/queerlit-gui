<template>

<div id="footer">
    <div id="developer-info">
      <div class="footer-info border-style">
        Queerlitprojektet bedrivs på <a href="https://gu.se/">Göteborgs universitet</a> i samarbete med
        <a href="http://www2.ub.gu.se/kvinn/">KvinnSam</a>,
        <a href="https://gu.se/digital-humaniora">GRIDH</a>,
        <a href="https://www.sh.se/">Södertörns högskola</a> och
        <a href="https://lnu.se/">Linnéuniversitetet</a>.
      </div>
      <div class="links-stack">
       

        <a class="site-link link" href="https://queerlit.dh.gu.se/om/" target="_blank">
          Mer om projektet Queerlit</a>
          <br>
        <a class="site-link link" href="https://queerlit.dh.gu.se/om/kontakt/"
          target="_blank">Kontakta oss</a> &emsp;|&emsp;Licens:   <a class="" href="https://creativecommons.org/publicdomain/zero/1.0/deed.sv">CCO</a> 
      </div>
      
    </div>
    <div class="partners">


      <a href="https://dh.gu.se/">
        <div class="GRIDHLogo" id="">GU / GRIDH</div>
      </a>

      <a href="http://www2.ub.gu.se/kvinn/">
        <div class="PartnerLogo" id="">KVINNSAM</div>
      </a>

    </div>
  </div>


 

</template>

<script setup lang="ts">
</script>

<style scoped>
#footer {
  background-color: rgb(111,126,121);
  color: white;
  line-height: 1;
  height: 80px;
  width: calc(100% + 2px);
  font-size: 12px;
  position: fixed;
  z-index: 3000;
  bottom: 0px;
  font-family: "Barlow Condensed", sans-serif;
}

@media screen and (max-width: 950px) {
#footer {
 display:none;
}
}




a {
  font-weight: normal;
  color:white!important;
}

a:visited{
  color:white!important;
}



  a:link {
    font-weight: bold;
    color: white !important;
    text-decoration: none;
  }

  a:visited {
    color: white !important;
  }

  a:hover {
    color: white !important;
  }

  a:hover {
    color: white !important;
  }

  .footer-info{
  width:250px;
  font-size:0.8em;
  line-height:1.2;
  padding-left:10px;
  margin-right:30px;
}

.foot-info a {
  display:inline !important;
}


  .partners {
    float: right;
    position: fixed;

    bottom: 0px;
    right: 0px;
    height: 80px;
  }

  .GRIDHLogo {
    float: right;
    margin-top: 30px;
    width: auto;
    height: auto;
    text-align: left;
    font-weight: 100;
    font-style: normal;
    font-size: 30px;
    line-height: 0.8;
    padding: 0px 50px 5px 30px;
    vertical-align: middle;
  }

  .PartnerLogo {
    float: right;
    margin-top: 30px;
    width: auto;
    height: auto;
    text-align: left;
    font-weight: 100;
    font-style: normal;
    font-size: 30px;
    line-height: 0.8;
    padding: 0px 30px 5px 30px;
    vertical-align: middle;
    border-width: 0px 0.5px 0px 0px;
    border-color: white;
    border-style: solid;
  }

  #developer-info {
    display: flex;
    align-items: flex-end;
    margin-left: 40px;
    margin-top: 15px;
    font-size: 1.5em;
    line-height: 1.4;
    font-weight: 200;
  }

  .border-style {
    border-width: 0 0.5px 0 0px;
    border-color: white;
    border-style: dashed;
    padding-left: 10px;
    padding-right: 20px;

  }

  .link {
    color: white;
  }

  .link:hover {
    opacity: 0.8;
  }

  .download-link {
    background: url("/downloadbuttonwhite.png");
    background-size: 18px;
    background-position: 0px 50%;
    background-repeat: no-repeat;
    padding-left: 25px;
    margin-left: 0px;
  }

  .site-link {
    background: url("/linkbuttonwhite.png");
    background-size: 18px;
    background-position: 0px 50%;
    background-repeat: no-repeat;
    padding-left: 25px;

  }

  .links-stack {
    margin-right: 20px;
  }

  .links-stack a {
  
  }

  #developer-info a:link {
    font-weight: 200;
  }
</style>
