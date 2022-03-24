var fastorder_ajax_timer;
Event.observe(window, 'load', (function() {

}));

/**
 * Search all simple produtcs matching current typed sku
 */
 function fastorder_searchResult(input_id) {

    if($(input_id).value.length >= fastorder_minAutocomplete)
    {
        var $autocomplete = $('fastorder_autocomplete_'+input_id.replace('fastorder-ref-', ''));

        //prepend close button
        $autocomplete.update('<ul></ul>');

        //prepend close button
        $autocomplete.update('<div class="fastorder-wrap-close"><a href="javascript:void(0);" class="fastorder-close" onclick="$(\'fastorder_autocomplete_'+input_id.replace('fastorder-ref-', '')+'\').hide();">'+close+'</a></div>'+$autocomplete.innerHTML);

        $($autocomplete).getElementsBySelector('ul').each(function(elem) {
            $(elem).update('<li class="loader">&nbsp;</li>');
        });
        $autocomplete.show();
        $autocomplete.style.display = 'block';

        var $keyword = $(input_id).value;

        var position = jQuery('#'+input_id).parent().parent().parent().index();

        fastorder_ajax_url = replaceUrl(fastorder_ajax_url);

        new Ajax.Request(
            fastorder_ajax_url, 
            {
                parameters: 'sku='+$keyword,
                method: 'post',
                evalJSON: true,
				dataType: "jsonp",
                onSuccess: function(transport, json) {
                    var data = transport.responseText.evalJSON(true);  

                    //append all results
                    $($autocomplete).getElementsBySelector('ul').each(function(elem) {
                        $(elem).update('');
                    });
                    
                    if(data.length>0) //results found
                    {
                        for(var i = 0; i < data.length; i++)
                        {
                            var $class = '';
                            if(i == 0) $class = 'selected';

                            $($autocomplete).getElementsBySelector('ul').each(function(elem) {
                                var nameProduct = data[i].name.toUpperCase();
                                var nameSearch = $keyword.toUpperCase();
                                var start1 = nameProduct.indexOf(nameSearch);
                                var end1 = start1 + nameSearch.length;
                                var $keyword1 = data[i].name.slice(start1, end1);
                                var nameSku = data[i].sku.toUpperCase();
                                var start2 = nameSku.indexOf(nameSearch);
                                var end2 = start2 + nameSearch.length;
                                var $keyword2 = data[i].sku.slice(start2, end2);
                                $(elem).update($(elem).innerHTML+'<li class="'+$class+'">'+
                                    '<a rel="'+data[i].sku+'" href="javascript:void(0);" onclick="selectSku(this, \''+input_id.replace('fastorder-ref-', '')+'\', \''+data[i].sku+'\',\''+position+'\');" data-fancybox-type="ajax">'+
                                    '<span class="product-image"><div class="animation"><img src="'+data[i].thumbnail+'" alt="" /></div></span>'+
                                    // '<span class="product-name">'+data[i].name.replace($keyword, '<span class="ref-part">'+$keyword+'</span>')+'<br/><span class="reference">'+fastorder_translate_ref+' '+data[i].sku.replace($keyword, '<span class="ref-part">'+$keyword+'</span>')+'</span>'+'</span>'+
                                    '<div class="product-info">'+
                                    '<span class="product-name">'+data[i].name.replace($keyword1, '<span class="ref-part">'+$keyword1+'</span>')+'</span><br>'+
                                    '<span class="product-sku">SKU#: '+data[i].sku.replace($keyword2, '<span class="ref-part">'+$keyword2+'</span>')+'</span><br>'+
                                    '</div>'+
                                    '<span class="product-price">'+data[i].price +'</span>'+
                                    '<span class="product-url no-display">'+data[i].url +'</span>'+
                                    '<span class="typeid no-display">'+data[i].typeid +'</span>'+
                                    '<span class="sku no-display">'+data[i].sku +'</span>'+
                                    '<span class="prodid no-display">'+data[i].prodid +'</span>'+
                                    '<span class="option no-display">'+data[i].option +'</span>'+
                                    '<div class="tierprice_group no-display">'+data[i].tierprices +'</div>'+
                                    '</a>'+
                                    '<div class="clear"></div>'+
                                    '</li>');
                            });
                        }
                        //add hover event on <li>
                        $($autocomplete).getElementsBySelector('ul li').each(function(elem) {
                            $(elem).observe('mouseover', function() {
                                $($autocomplete).getElementsBySelector('ul li').each(function(all_li) {
                                    $(all_li).removeClassName('selected');
                                });
                                $(elem).addClassName('selected');
                            });
                        });
                        $($autocomplete).getElementsBySelector('ul li').each(function(elem) {
                            $(elem).observe('mouseout', function() {
                                $(elem).removeClassName('selected');
                            });
                        });                     
                    }
                    else //no results found
                    {
                        $($autocomplete).getElementsBySelector('ul').each(function(elem) {
                            $(elem).update('<li class="fastorder-no-results">No result</li>');
                        });
                    }

                }
            }
            );
}
}

/**
 * Populate a row with selected values
 */
 function selectSku(elem, result_id, sku,position)
 {  
    var $autocomplete = $('fastorder_autocomplete_'+result_id);
    $autocomplete.hide(); 

    var $img;
    $(elem).getElementsBySelector('.product-image').each(function(img) {
        $img = img.innerHTML;
    }); 

    var $name;
    $(elem).getElementsBySelector('.product-name').each(function(name) {
        $name = name.innerHTML;
    }); 

    var $url;
    $(elem).getElementsBySelector('.product-url').each(function(url) {
        $url = url.innerHTML;
    }); 

    var $price;
    $(elem).getElementsBySelector('.product-price').each(function(price) {
        $price = price.innerHTML;
    }); 

    var $typeid;
    $(elem).getElementsBySelector('.typeid').each(function(typeid) {
        $typeid = typeid.innerHTML;
    }); 
    var $sku;
    $(elem).getElementsBySelector('.sku').each(function(sku) {
        $sku = sku.innerHTML;
    }); 
    var $prodid;
    $(elem).getElementsBySelector('.prodid').each(function(prodid) {
        $prodid = prodid.innerHTML;
    }); 
    var $option;
    $(elem).getElementsBySelector('.option').each(function(option) {
        $option = option.innerHTML;
    });

    var data = '';
    if($typeid == 'configurable') {
        data = {product : $prodid, qty: 1,row: result_id,position: position,fastorder:1};
    }
    if($typeid !== 'configurable' && $option == 1) {
        data = {product : $prodid, qty: 1,row: result_id,position: position,no_configurable:1,fastorder:1};
    }
    if(data){
        if(jQuery('.page .price-box .old-price #old-price-'+$prodid).length > 0){
            jQuery('.page .price-box .old-price #old-price-'+$prodid).attr('id','fastorder-old-price-'+$prodid);
            jQuery('.page .price-box .old-price #old-price-'+$prodid+'_clone').attr('id','fastorder-old-price-'+$prodid+'_clone');
        }
        if(jQuery('.page .tier-prices .price').length > 0){
            jQuery('.page .tier-prices .price').attr('class','fastorder-price');
        }
        jQuery.fancybox_fastorder.showLoading();
        jQuery('.page .price-box #product-price-'+$prodid).attr('id','fastorder-product-price-'+$prodid);
        jQuery('.page .price-box #product-price-'+$prodid+'_clone').attr('id','fastorder-product-price-'+$prodid+'_clone');

        fastorder_ajax_cart_option = replaceUrl(fastorder_ajax_cart_option);

        jQuery.ajax({
            cache: false,
            url: fastorder_ajax_cart_option, 
            data: data,
            success: function (data) {
                jQuery.fancybox_fastorder(data, {
                    'titlePosition'     : 'inside',
                    'minWidth'          : '250px',
                    'transitionIn'      : 'none',
                    'transitionOut'     : 'none',
                    'height'            :'auto',
                    'autoSize'          : true,
                    'closeClick'          : false, 
                    'helpers'             : { 
                                            overlay : {closeClick: false},
                                            fixed   : false,
                                        },
                    'afterClose': (function() {
                        if(jQuery('.page .price-box #fastorder-product-price-'+$prodid+'_clone').length >0){
                            jQuery('.page .price-box #fastorder-product-price-'+$prodid+'_clone').attr('id','product-price-'+$prodid+'_clone');
                        }
                        if(jQuery('.page .price-box #fastorder-product-price-'+$prodid).length >0){
                            jQuery('.page .price-box #fastorder-product-price-'+$prodid).attr('id','product-price-'+$prodid);
                        }
                        if(jQuery('.page .price-box .old-price #fastorder-old-price-'+$prodid+'_clone').length >0){
                            jQuery('.page .price-box .old-price #fastorder-old-price-'+$prodid+'_clone').attr('id','old-price-'+$prodid+'_clone');
                        }
                        if(jQuery('.page .price-box .old-price #fastorder-old-price-'+$prodid).length >0){
                            jQuery('.page .price-box .old-price #fastorder-old-price-'+$prodid).attr('id','old-price-'+$prodid);
                        }
                        if(jQuery('.page .tier-prices .fastorder-price').length > 0){
                            jQuery('.page .tier-prices .fastorder-price').attr('class','price');
                        }
                    }),
                }); 
            } 
        }); 
    }
    var $tierprice;
    $(elem).getElementsBySelector('.tierprice_group').each(function(tierprice) {
        $tierprice = tierprice.innerHTML;
    });
    if($tierprice){
        $$('#fastorder-'+result_id+' .fastorder-row-qty .price_group').each(function(tierprice) {
            $(tierprice).update($tierprice);
        });
    }

    $$('#fastorder-'+result_id+' .fastorder-row-image').each(function(img) {
        $(img).update($img);
    });
    $$('#fastorder-'+result_id+' .fastorder-row-name').each(function(name) {
        $(name).update('<div><a class="animation" target="_blank" href="'+ $url +'">'+$name+'</a>'+'<br><span class="reference"></span>' + $price + '</div><div class="row-loader"></div>');
    });

    // $$('#fastorder-'+result_id+' .fastorder-row-price').each(function(total) {
    //     $(total).update($price);
    // });

    //button add edit
    $('fastorder-add-'+result_id).removeClassName('disabled');
    if($typeid == 'configurable' || $option == 1){
        $('fastorder-edit-'+result_id).removeClassName('disabled');
    }else{
        $('fastorder-edit-'+result_id).addClassName('disabled');
    }

    //complete the search field
    $('fastorder-ref-'+result_id).value = sku;
    jQuery('#fastorder-ref-'+result_id).attr('value',sku);
    $$('#fastorder-'+result_id+' input.sku').each(function(input) {
        $(input).value = sku;
    });
    $$('#fastorder-'+result_id+' input.typeid').each(function(input) {
        $(input).value = $typeid;
    });

    //animate image & name
    $$('#fastorder-'+result_id+' .fastorder-row-image div.animation').each(function(animation) {
        new Effect.Morph(
            $(animation), 
            {
                style: {left: '0px'},
                duration: 0.5,
                afterFinish: 
                function() {
                    $$('#fastorder-'+result_id+' .fastorder-row-name div.animation').each(function(animation2) {
                        new Effect.Morph(
                            $(animation2),
                            {
                                style: {left: '0px'},
                                duration: 0.5
                            }
                            );
                    });
                }
            }
            );
    });
    totalPrice(elem);
}

/**
 * Manage down and up arrow to select product between the ones available
 */
 function fastorder_manageArrow(elem_id, type)
 {
    $autocomplete = $('fastorder_autocomplete_'+elem_id);
    var $elem;

    if(type=='down')
    {
        if($($autocomplete).getElementsBySelector('ul li').length > 0)
        {
            $($autocomplete).getElementsBySelector('li.selected').each(function(li) {
                $elem = li;
            });
            $($autocomplete).getElementsBySelector('ul li:last').each(function(elem) {
                if($(elem).hasClassName('selected')) //we reached the bottom
                {
                    $($autocomplete).getElementsBySelector('ul li:first')[0].addClassName('selected');
                    $($autocomplete).getElementsBySelector('ul li:last')[0].removeClassName('selected');
                }
                else if($elem)
                {
                    $elem.removeClassName('selected');
                    $elem.next().addClassName('selected');                    
                }
            });
            if(!$elem)
            {
                $($autocomplete).getElementsBySelector('ul li:first')[0].addClassName('selected');
            }
        }
    }
    else if(type=='up')
    {
        if($($autocomplete).getElementsBySelector('ul li').length > 0)
        {
            $($autocomplete).getElementsBySelector('li.selected').each(function(li) {
                $elem = li;
            });
            $($autocomplete).getElementsBySelector('ul li:first').each(function(elem) {
                if($(elem).hasClassName('selected')) //we reached the bottom
                {
                    $($autocomplete).getElementsBySelector('ul li:first')[0].removeClassName('selected');
                    $($autocomplete).getElementsBySelector('ul li:last')[0].addClassName('selected');
                }
                else if($elem)
                {
                    $elem.removeClassName('selected');
                    $elem.previous().addClassName('selected');                    
                }
            });
            if(!$elem)
            {
                $($autocomplete).getElementsBySelector('ul li:last')[0].addClassName('selected');
            }
        }
    }
 }


/**
 * Manage enter and ok button
 */
 function fastorder_manageEnterAndOkButton(elem_id)
 {

    $id = elem_id.replace('fastorder-ref-', '');

    if($$('#fastorder_autocomplete_'+$id+' ul li.selected').length>0) //if one product is selected, add it to the cart
    {
        selectSku($$('#fastorder_autocomplete_'+$id+' ul li.selected a')[0], $id, $$('#fastorder_autocomplete_'+$id+' ul li.selected a')[0].readAttribute('rel'));
    }
    else //no results => redo a search
    {
        window.clearTimeout(fastorder_ajax_timer);
        fastorder_ajax_timer = window.setTimeout("fastorder_searchResult('"+elem_id+"')", 500);            
    }
}

//reset row select
function fastorder_reset(id) {
    $('fastorder-ref-'+id).value = '';
    $$('#fastorder-'+id+' .fastorder-row-image')[0].update('&nbsp;');
    $$('#fastorder-'+id+' .fastorder-row-name')[0].update('&nbsp;');
    $$('#fastorder-'+id+' .fastorder-row-price')[0].update('<span class="price"></span>');
    $$('#fastorder-'+id+' input.qty')[0].value = '1';
    $$('#fastorder-'+id+' input.sku')[0].value = '';
    $$('#fastorder-'+id+' input.typeid')[0].value = '';
    jQuery('#fastorder-ref-'+id).attr('value','');
    $('fastorder-add-'+id+'').addClassName('disabled');
    $('fastorder-edit-'+id+'').addClassName('disabled');
}

function fastorder_resetAll() {
    jQuery('#fastorder_form').html(oldform);
}

function fastorder_options(row,price,text,qty) {
    // console.log(value);
    jQuery('#fastorder-'+row).find('.reference').html(text);
    jQuery('#fastorder-'+row).find('.price').text(price);
    finalprice   = price.replace(fastorder_currency,"");
    jQuery('#fastorder-'+row).find('.fastorder-row-qty .finalprice').val(finalprice);
    totalPrice(jQuery('#fastorder-'+row).find('.fastorder-row-qty .qty'));
}



function fastorder_add_row_option(row1,row2,price,text,qty) {

    var clone = jQuery('#fastorder-'+row1).clone();
    while(jQuery('#fastorder_form').find('#fastorder-'+row2).length > 0 ) {
        row2 = row2/1 + 100;
    }
    clone.attr('id', 'fastorder-'+row2 );
    clone.find('#fastorder-ref-'+row1).attr('id', 'fastorder-ref-'+row2 );
    clone.find('#fastorder-'+row1+'-search').attr('id', 'fastorder-'+row2+'-search' );
    clone.find('#fastorder_autocomplete_'+row1).attr('id', 'fastorder_autocomplete_'+row2 )
    clone.find('#fastorder-add-'+row1).attr('id', 'fastorder-add-'+row2 );
    clone.find('.reference').text(text);
    clone.find('.price').text(price);
    clone.find('input.qty').val(qty);
    clone.insertAfter('#fastorder-'+row1);
}



function fastorder_create() {
    var length = jQuery('#fastorder .fastorder-multiple-form tbody > tr').length;
    var form1 = '<tr class="fastorder-row" id="fastorder-'+ length +'">'+form+'</tr>';
    form1 = form1.replace(/fastorder-ref-1/g,"fastorder-ref-"+length);
    form1 = form1.replace(/fastorder-1-search/g,"fastorder-"+length+'-search');
    form1 = form1.replace(/fastorder_autocomplete_1/g,"fastorder_autocomplete_"+length);
    form1 = form1.replace(/fastorder-add-1/g,"fastorder-add-"+length);
    form1 = form1.replace(/fastorder-edit-1/g,"fastorder-edit-"+length);
    jQuery('.fastorder-multiple-form').append(form1);
    fastorder_reset(length);
}
//submit send form
function fastorder_submit_form(){
    jQuery('#fastorder .messages').empty();
    jQuery('.fastorder-multiple-form tr.row-loader-bg').css('opacity','0.5');
    // jQuery('#fastorder_form').submit(function(e) {
        jQuery.fancybox_fastorder.showLoading();
        //13/2/2017
        var fastorder_form_ajax_cart = jQuery('#fastorder_form').attr('action');

        fastorder_form_ajax_cart = replaceUrl(fastorder_form_ajax_cart);

        jQuery.ajax({
            type: jQuery('#fastorder_form').attr('method'),
            url : fastorder_form_ajax_cart,
            data: {items: jQuery('form#fastorder_form').serialize()},
            success: function(msg) {
                jQuery.fancybox_fastorder.hideLoading();
                jQuery('.fastorder-multiple-form tr.row-loader-bg').css('opacity','1');
                var res = msg.evalJSON();
                // if(jQuery('.checkout-cart-index .cart').length == 0){
                //     jQuery('.cart-empty').prev().remove();
                //     if($$('.cart-empty').length == 0){
                //         jQuery('.cart').replaceWith('<div class="cart"><br/><br/><br/><br/><br/><br/></div>');
                //     }else{
                //         jQuery('.cart-empty').replaceWith('<div class="cart"><br/><br/><br/><br/><br/><br/></div>');                
                //     }
                // }
                if(res.success){
                    // updateBlocks(res.update_blocks);
                    jQuery('#fastorder .messages').append('<div class="success-msg">'+res.messagesuccess+'</div>');
                    // fastorder_resetAll();
                    window.location.href = fastorder_checkout_cart;
                }else{
                    jQuery('#fastorder .messages').append('<div class="error-msg">'+res.messageerror+'</div>');
                }
            },
        });
    // });
}
jQuery(document).ready(function() {
    jQuery(window).bind('beforeunload', function(){
        if(jQuery('#fastorder').length > 0 && jQuery('#fastorder .success-msg').length == 0){
            if(!popup){
                fastorder_ajax_session_form = replaceUrl(fastorder_ajax_session_form);
                jQuery.ajax({
                    url: fastorder_ajax_session_form, 
                    type: 'POST',
                    async: false,
                    data: {formsession: jQuery('#fastorder').html()},
                    // success: function (data) {
                    //     console.log(data);
                    // }
                });
            }
        }
    });
    //lightbox
    jQuery(document).on('click','.fastorder-row-image',function() {
        if(jQuery(this).parent().attr('id').replace('fastorder-','') != 0 && jQuery(this).children().length > 0 ) {
            var html = jQuery(this).children().html();
            jQuery('.fastorder-thumbnail-container').html(html);
            jQuery('.fastorder-thumbnail-container').css({
                width:'100%',height:'100%',position:'fixed','z-index':'2147483650',
                'background-color':'rgba(53, 53, 53, 0.64)',display:'block',top:0,left:0
            });
            jQuery('.fastorder-thumbnail-container').children().css({
                width:'auto',height:'85%','z-index':'1000',margin:'0 auto', display: 'block','margin-top':'2%'
            });
        };
    });

    //turn off lightbox
    jQuery(document).on('click','.fastorder-thumbnail-container',function() {
        jQuery(this).hide();
    })

    //turn off submit form when press enter
    jQuery(document).on('keydown','.fastorder-row-ref .input-text',function(e) {
        if(e.keyCode == 13) 
        {
            e.preventDefault();
        };
    });
    jQuery(document).on('keydown','.fastorder-row-qty .qty',function(e) {
        if(e.keyCode == 13) 
        {
            e.preventDefault();
        };
    });

    //event when type in input 
    jQuery(document).on('keyup','.fastorder-row-ref .input-text',function(e) {
        if(e.keyCode == 13) //touche enter
        {
            fastorder_manageEnterAndOkButton(jQuery(this).attr('id'));
        }
        if(e.keyCode == 8 || e.keyCode == 46) //suppr // backspace
        {
            window.clearTimeout(fastorder_ajax_timer);
            fastorder_ajax_timer = window.setTimeout("fastorder_searchResult('"+jQuery(this).attr('id')+"')", 500);
        }
        else if(e.keyCode == 38) //arrow top => move selection
        {
            fastorder_manageArrow(jQuery(this).attr('id').replace('fastorder-ref-', ''), 'up');
        }
        else if(e.keyCode == 40) //arrow down => move selection
        {
            fastorder_manageArrow(jQuery(this).attr('id').replace('fastorder-ref-', ''), 'down');
        }
        else if(e.keyCode == 27) //touche echap => close autocomplete
        {
            jQuery('fastorder_autocomplete_'+jQuery(this).attr('id').replace('fastorder-ref-', '')).hide();
        }
        else if('azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN1234567890'.indexOf(String.fromCharCode(e.keyCode)) != -1) //other allowed char.
        {
            window.clearTimeout(fastorder_ajax_timer);
            fastorder_ajax_timer = window.setTimeout("fastorder_searchResult('"+jQuery(this).attr('id')+"')", 500);
        };

                //If sku is too small, disabled the OK button
                if(!jQuery(this).val().length >= fastorder_minAutocomplete)
                {   
                    jQuery(this).parent().next('.fastorder_autocomplete').hide();
                };
            });

        /**
        * Add button
        */
        jQuery(document).on('click','.fastorder-row-add .btn-ok',function() {
            if(!jQuery(this).hasClass('disabled')) {
                jQuery(this).closest('tr.fastorder-row').find('.fastorder-row-qty .qty').val(0).change();
                fastorder_reset(jQuery(this).attr('id').replace('fastorder-add-',''));
            }
        });


        /**
        * Event triggered when pressing OK button of the search field
        */
        jQuery(document).on('click','.fastorder-row-ref button',function() {
            if(!jQuery(this).hasClass('disabled'))
            {
                fastorder_manageEnterAndOkButton(jQuery(this).prev().attr('id'));
            };
        });
    jQuery(document).on('change','#fastorder .fastorder-row-qty .qty',function(){
        jQuery('#fastorder_form .validation-advice').remove();
        var sku = jQuery(this).next().val();
        var typeid = jQuery(this).next().next().val();
        jQuery(this).attr('value',jQuery(this).val());
        if(sku && typeid){
            totalPrice(this);
        }
    });
  
    jQuery('.bss-fastorder').featherlight({
        loading: '<div id="fountainTextG"><div id="fountainTextG_1" class="fountainTextG">L</div><div id="fountainTextG_2" class="fountainTextG">o</div><div id="fountainTextG_3" class="fountainTextG">a</div><div id="fountainTextG_4" class="fountainTextG">d</div><div id="fountainTextG_5" class="fountainTextG">i</div><div id="fountainTextG_6" class="fountainTextG">n</div><div id="fountainTextG_7" class="fountainTextG">g</div></div>',
        root: '.wrapper',
        beforeClose: function(event){
            fastorder_ajax_session_form = replaceUrl(fastorder_ajax_session_form);
            jQuery.ajax({
                url: fastorder_ajax_session_form, 
                type: 'POST',
                data: {formsession: jQuery('#fastorder').html()},
                // success: function (data) {
                //     console.log(data);
                // }
            });
        },
        afterClose: function(event){
            optionsPrice = optionsPrice2;
        },
        beforeOpen: function(event){
            if(jQuery('.datetime-picker').length > 0){
                jQuery('.datetime-picker').each(function(){
                    jQuery(this).next().attr('id','');
                });
            }
        },
    });
});
function convertPrice(price) {
    if(separator == '.') {
        price = parseFloat(price).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
    } else {
        price = parseFloat(price).toFixed(2);
        price = price.replace(/\./g,",");
        price = price.replace(/(\d)(?=(\d{3})+\,)/g, "$1.")
    }
    return price;
}
function totalPrice(e){
    var subtotal = 0;
    var qty  = jQuery(e).closest('.fastorder-row').find('.fastorder-row-qty .qty').val();
    /* start add tier price */
    total_1  = jQuery(e).closest('.fastorder-row').find('.fastorder-row-name .price').text();
    finalprice   = total_1.replace(fastorder_currency,"");
    if(separator == '.') {
        finalprice   = parseFloat(finalprice.replace(/[^0-9\.]+/g,""));
    } else {
        finalprice = finalprice.replace(/\./g, '');
        finalprice = parseFloat(finalprice.replace(/\,/g, '.'));
    }
    if(jQuery(e).parent().find('.price_group .tierprice').length > 0){
        var i = 0;
        jQuery(e).closest('.fastorder-row').find('.fastorder-row-qty .price_group').children('input').each(function(){
            tierprice = parseFloat(jQuery(this).attr('data-qty'));
            if(qty < tierprice && qty!= 0 ) {
                number = (jQuery(this).prev().val());
                return false;
            }
            if(qty >= tierprice && qty!= 0 && !jQuery(this).next().attr('data-qty')){
                number = (jQuery(this).val());
                return false;
            }
            i++;
        });
    }else{
        number = finalprice;
    }
    /* end add tier price */
    total_2  = parseFloat(qty) * number;
    total    = priceFormat.pattern.replace('%s', convertPrice(total_2));
    jQuery(e).closest('.fastorder-row').find('.fastorder-row-price .price').text(total);
    jQuery(e).closest('.fastorder-row').find('.fastorder-row-qty .price_group .finalprice').val(finalprice);
    jQuery('.fastorder-row-price .price').each(function(){
        totalRow = jQuery(this).text();
        if(totalRow == '') return;
        totalFomat = totalRow.replace(fastorder_currency,'');
        if (separator == ',') {
            totalFomat = totalFomat.replace(/\./g,'');
            totalFomat = totalFomat.replace(/\,/g,'.');
        }
        totalFomat = totalFomat.replace(/\,/g,'');
        subtotal += parseFloat(totalFomat);
    });
    subtotalFomat = priceFormat.pattern.replace('%s', convertPrice(subtotal));
    jQuery('#fastorder .price-value').text(subtotalFomat);
}
function editConfigurable(e){
    sku = jQuery(e).parent().parent().find('.fastorder-row-qty .sku').val();
    jQuery(e).parent().parent().find('.fastorder_autocomplete a').each(function(){
        if(jQuery(this).attr('rel') == sku) {
            jQuery(this).click();
        }
    });
}
function importCsv(e){
    jQuery('#fastorder .messages').empty();
    var formatFile = jQuery('#fastorder #file').val().split('.').pop().toLowerCase();
    if(formatFile == '' || formatFile != 'csv'){
        jQuery('#fastorder .messages').append('<div class="error-msg">'+errorFomat+'</div>');
        return false;
    }
    var formImport = e.target
    var formData = new FormData(formImport);
    var error1 = false;
    var error2 = false;

    fastorder_import_ajax = replaceUrl(jQuery("form#data").attr('action'));

    jQuery.ajax({
        url: fastorder_import_ajax,
        type: 'POST',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
		dataType: "json",
        success: function (data) {
            if(!data){
                jQuery('#fastorder .messages').append('<div class="error-msg">'+errorFomat+'</div>');
            }else{
                //jQuery.each(jQuery.parseJSON(data), function() {
					jQuery(data).each(function(i, item) {
                    if(this.error){
                        error1 = true;
                        return false;
                    }
                    if(this.error2){
                        error2 = true;
                        return;
                    }
                    var length = jQuery('#fastorder .fastorder-multiple-form > div').length;
                    for(var j=1;j<length;j++){
                        var target2 = '#fastorder-' + j;
                        sku2 = jQuery(target2).find('.fastorder-row-qty .sku').val();
                        typeid2 = jQuery(target2).find('.fastorder-row-qty .typeid').val();
                        if(sku2 == this.sku && typeid2 == this.typeid){ //alert(this.sku);                          
                            qtyOld = jQuery(target2).find('.fastorder-row-qty .qty').val();
                            if(this.qty) {
                                qtyUpdate = parseFloat(this.qty);
                            }else{
                                qtyUpdate = 1;
                            }
                            qtyNew = qtyUpdate + parseFloat(qtyOld);
                            jQuery(target2).find('.fastorder-row-qty .qty').val(qtyNew);
                            totalPrice(jQuery(target2).find('.fastorder-row-qty .qty'));
                            return;
                        }
                    }
                    for(var i=1;;i++){
                        var target = '#fastorder-' + i;
                        if(jQuery(target).length == 0){
                            fastorder_create();
                        }
                        sku = jQuery(target).find('.fastorder-row-qty .sku').val();
                        typeid = jQuery(target).find('.fastorder-row-qty .typeid').val();
                        if(sku == '' && typeid == ''){
                            break;
                        }
                    }
                    var autocomplete = '#fastorder_autocomplete_'+i;
                    position = jQuery('#fastorder-ref-'+i).parent().parent().parent().index();                    
                    jQuery(autocomplete).find('ul').replaceWith('<ul><li>'+
                        '<a rel="'+this.sku+'" href="javascript:void(0);" onclick="selectSku(this, \''+i+'\', \''+this.sku+'\',\''+position+'\');">'+
                        '<span class="product-image"><div class="animation"><img src="'+this.thumbnail+'" alt="" /></div></span>'+
                        '<span class="product-name">'+this.name+'</span><br>'+
                        '<span class="product-price">'+this.price +'</span>'+
                        '<span class="product-url no-display">'+this.url +'</span>'+
                        '<span class="typeid no-display">'+this.typeid +'</span>'+
                        '<span class="sku no-display">'+this.sku +'</span>'+
                        '<span class="prodid no-display">'+this.prodid +'</span>'+
                        '<span class="option no-display">'+this.option +'</span>'+
                        '</a>'+
                        '<div class="clear"></div>'+
                        '</li></ul>');
                    qty = parseFloat(this.qty);
                    if(qty){ 
                        jQuery(target).find('.fastorder-row-qty .qty').val(qty);
                        jQuery(target).find('.fastorder-row-qty .qty').attr('value',qty);//alert(this.qty);
                        totalPrice(jQuery(target).find('.fastorder-row-qty .qty'));
                    } 
                    var select = '#fastorder_autocomplete_' + i;
                    jQuery(select).each(function(){
                        jQuery(this).find('li:first a').click();
                    });
                });
                if(error1){
                    jQuery('#fastorder .messages').append('<div class="error-msg">'+errorItem+'</div>');
                }else if(error2){
                    jQuery('#fastorder .messages').append('<div class="error-msg">'+errorProduct+'</div>');
                }else{
                    jQuery('#fastorder .messages').append('<div class="success-msg-import">'+importSuccess+'</div>');
                }
            }
        }
    });
    return false;
}
function replaceUrl(url){
    if (location.protocol == 'https:' && url.indexOf("https:") < 0)
    {
         url = url.replace("http:", "https:");
    }
    if (location.protocol != 'https:' && url.indexOf("http:") < 0)
    {
         url = url.replace("https:", "http:");
    }
    return url;
}
// function updateBlocks(blocks) {
//         var _this = this;

//         if(blocks) {
//             try{
//                 blocks.each(function(block){
//                     if(block.key) {
//                         var dom_selector = block.key;
//                         if($$(dom_selector)) {
//                             $$(dom_selector).each(function(e){
//                                 $(e).update(block.value);

//                             });
//                         }
//                     }
//                 });
//             } catch(e) {
//                 console.log(e);
//             }
//         }

//     }