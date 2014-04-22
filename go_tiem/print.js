$('document').ready(function(){

  // The gist is to make a print-ready CSS file that gets slipped into the head.

  // Lukas WinklerPrins
  // Updated 20 April 2014

  // 1in = 6pc = 72pt
  // 1cm = 2.36pc = 28.3pt

  // Damn dog what kind of resolution we wanna print at? aka pushing pixel units to inches

  var p_width = 8.5;
  var p_length = 11;
  var p_unit = "in";
  var type = "pattern"; // pattern or chunks
  var kind = "fixed"; // scroller or fixed (if a pattern)

  // here is the question... for patterns, print out one page? or the whole shebang?

  var browser_window_sizing = 0;

  if(browser_window_sizing){
    p_width = $(window).width();
    p_length = $(window).height();
    p_unit = "px"; // ugh
  }

  var p_m = ""; // this will be the string we add all styling to.

  //////////////////////////////////////////////////////
  // Check for a container/wrapper of the entire document
  var wrap_name = $("body > div").eq(0).attr('id');
  var wrap_identifier = "#";
  var no_wrap;
  if(wrap_name == null){
    wrap_name = $("body > div").eq(0).attr('class');
    wrap_identifier = ".";
    no_wrap = 0;
  }
  if(wrap_name != 'container' && wrap_name != 'wrapper'){
    // there isn't a wrapper. Let's make one! (happens later)
    no_wrap = 1;
    wrap_name = "body";
    wrap_identifier = "";
  }

  var num_cont = $(wrap_identifier+wrap_name+" > div").length;
  //alert("There are "+parseInt(num_cont)+" container divs.");

  //////////////////////////////////////////////////////
  //////////////////////////////////////////////////////
  for(var i = 0; i < num_cont; i++){

    var cont_identifier = "#"; // Start by assuming the first div on the pattern repeat page is a lil container
    var cont_name = $(wrap_identifier+wrap_name+" > div").eq(i).attr('id');

    if(cont_name == null){
      cont_identifier = ".";
      cont_name = $(wrap_identifier+wrap_name+" > div").eq(i).attr('class');
      if(cont_name == null){
        // still! Just unadorned <div> then
        cont_name = "";
        cont_identifier = wrap_identifier+wrap_name+" div:eq("+i+") > ";

      }else if(0){
        //alert("Please make sure your pattern begins with a container-style div");
        alert("Your document structure might not match print.js' needs.");
        cont_name = null;
      }
    }

    // assumes all lil repeated nuggets are just divs or share the same class
    var num_repeat = 0;
    var repeat_name = "";

    repeat_name = $(cont_identifier+cont_name+" > div").eq(0).attr("class"); // class because they're repeats obvi nubcake

    if(repeat_name == null){
      num_repeat = $(cont_identifier+cont_name+" div").length;
      // repeats just unnamed divs
    }else{
      num_repeat = $(cont_identifier+cont_name+" div."+repeat_name).length;
    }
    //alert("There are "+parseInt(num_repeat)+" repeats named "+repeat_name+" in the container "+cont_name+", one of "+num_cont+" containers.");

    //////////////////////////////////////////////////////
    // Styling each container, and repeat if appropriate.

    var cont_p_width = 2+p_width; // gotta do this separate from string combining
    var cont_p_length = 1+p_length;

    var cont_css = "{ overflow: hidden; width: "+cont_p_width+p_unit+"; ";
    if(kind == "scroll"){
      cont_css = cont_css + "position: absolute; ";
    }else if(kind=="fixed"){
      cont_css = cont_css + "height: "+cont_p_length+p_unit+"; position: fixed; ";
    }
    cont_css = cont_css + "top: -1"+p_unit+"; left: -1"+p_unit+"; } ";

    var repeat_css = "{} ";

    p_m = p_m + cont_identifier + cont_name + cont_css;

    if(repeat_name == null){
      p_m = p_m + cont_identifier+cont_name+" > div" + repeat_css;
    }else{
      p_m = p_m + "."+repeat_name+repeat_css;
      // must be a class, not ID
    }

  }
  //////////////////////////////////////////////////////
  // end the containers loop. Style body & wrapper.
  var wrap_css = "{";
  if(no_wrap){
    // let's wrap this shit
    wrap_name = "printjswrapper";
    wrap_identifier = "#";
    var temp_prewrap = $("body").html();
    var temp_postwrap = "<div id='printjswrapper'>"+temp_prewrap+"</div>";
    $("body").html(temp_postwrap);
  }

  wrap_css = wrap_css + "overflow: hidden; width: "+p_width+p_unit+"; ";

  if(kind == "scroll"){
    wrap_css = wrap_css + "";
    // length can be full, go over multiple pages.
  }else if(kind=="fixed"){
    wrap_css = wrap_css + "height: "+p_length+p_unit+"; ";
  }
  wrap_css = wrap_css + "} ";
  p_m = p_m + wrap_identifier+wrap_name+wrap_css;

  p_m = p_m + "body{height: "+p_length+p_unit+"; width: "+p_width+p_unit+"; overflow: hidden;} "; // background-color: transparent ???

  //////////////////////////////////////////////////////
  // END STUFF—finishes the @media print CSS thingy, assuming all existinc CSS is for screen (could use a check)
  var css = $("style").html();
  // when "screen" media left unspecified, @print just writes on top of the normal style (good to retain the page's inherent style)
  css = css + "@media print{" + p_m+"} "; // consider adding "reset" ... ? Probably dangerous.
  //css = css + p_m; // for testing purposes only

  //css = css + '@page{margin: 2pc; @top-center{content: "hi this is at the top  center";}} '; // thiiiiiiis (@page) doesn't work.

  var reset = "html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var,b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video {	margin: 0; 	padding: 0; 	border: 0; 	font-size: 100%; 	font: inherit; 	vertical-align: baseline; }/* HTML5 display-role reset for older browsers */article, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section {	display: block;} body {	line-height: 1;} ol, ul {	list-style: none;} blockquote, q {	quotes: none;} blockquote:before, blockquote:after, q:before, q:after {	content: ''; 	content: none; } table {	border-collapse: collapse; 	border-spacing: 0; }";
  // currently unused but could be.

  if($("style").html() == null){
    // if no <style> tag, e.g. no css or just a linked stylesheet
    $("head").append("<style>"+css+"</style>");
    // dangerously might overrule the normal linked stylesheet tag
    //$('head').append('<link rel="stylesheet" href="URL to your print.css" type="text/css" media="print" />') ???
  }else{
    $("style").html(css);
  }

  //window.print();
});

// TO ADD: ///////////////////////////////////////////////////////////////////////
// CHECK looping for multiple containers
// CHECK container wrapping—fix to 11x17 size, now via body
// CHECK double check .html() command
// CHECK (kinda) convert to picas/points...
// CHECK accomodate for no existing <style> tag, i.e. external stylesheet
// NOPE turning images off?
// CHECK collab with cathland
// NOPE adjust print output to browser window size ???
// CHECK multiple media formats
// CHECK look for total wrapper
// NOPE center the material in the page - done via margins or not necessary honestly
// CHECK allow for printing to size of browser window - can't do it dynamically tho rn
// CHECK allow for fixed vs long-scroll print-outs. But I think you should focus on fixed pages?
// CHECK add wrapper no matter what...?
// make it OK for SINGLE PAGES
// some material still peeking off of pages—WHY???  due to margins?
//
// options for "chunking" vs "overlapping" ?
// span, h1, h2, h3 ... cases instead of div ?
// accommodate for margins of printed page when setting size
// consider crop marks
// resize containers so that no - left positioning and early right cutoff happens
// make "scroll" format so p_length is document height


// SOME NOTES:
// > All javascript must be in the head or external file. None in the body. Use jquery!
// > Then put print.js at the very end of your head.
// > The outside thing should be called either "wrapper" or "container" otherwise it will assume it is a structural div rather than big old wrapper thingy
// > Structure goes body > "wrapper" > container divs > pattern divs <<<
// > Write your CSS in a <style> tag rather than on a separate .css file.
// > REQUIRES <!DOCTYPE HTML> tag at beginning (??? what??? for $(document).height() and stuff)
// > not some pattern edges will be cut off
