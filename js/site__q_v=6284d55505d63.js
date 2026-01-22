

$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});



$(document).ready(function () {

    $(document)
        .on('click', '[data-submit]', function (e) {
            e.preventDefault();
            var $a = $(this),
                $f = $($a.data('submit'));
            if ($f.length) {
                $f.submit();
            }
        })
        .on('submit', 'form[data-ajax-form]', function (e) {
            e.preventDefault();
            e.stopPropagation();
            ajax_form_handle(this);
        })
        ;

    $('form[data-hp]').each(function () {
        var $f = $(this),
            field = $f.data('hp'),
            $input = $f.find('[name="'+field+'"]'),
            $cont = $input.parents('.form-group');
        $cont.hide();
    });
});

$('form[data-hp]').on('submit', function (e) {
    var $f = $(this),
        field = $f.data('hp'),
        $i = $f.find('input[name="hp"]');
    if (!$i.length) {
        $f.append('<input type="hidden" name="hp" value="'+field+'">');
    }
    return true;
});


function ajax_form_handle(f) {
    var $f = $(f),
        url = $f.attr('action');
    if (!ajax_form_init($f)) return;
    $.ajax(url, {
        'method': 'post',
        'data': $f.serialize(),
        'dataType': 'json',
        'success': function (data) {
            if (data.redirect) document.location.href = data.redirect;
            if (data.success) {
                if ($f.data('ajax-form')) {
                    var callback = $f.data('ajax-form');
                    if (window[callback]) window[callback]($f, data);
                }
            } else {
                $f.find('[data-form-errors]').show();
                for (var prop in data.errors) {
                    var $div = $f.find('[data-errors-for="' + prop.split('.')[0] + '"]');
                    if ($div.length) {
                        $div.text(data.errors[prop][0]).show();
                        continue;
                    }
                    var $i = $f.find('[name="' + prop + '"]');
                    if (!$i.length) $i = $f.find('[name="' + prop + '[]"]'); // example: checkboxes
                    if (!$i.length) $i = $f.find('[id="' + prop + '"]'); // example: translations, nested arrays
                    if (!$i.length) continue;
                    var $p = $i.parent();
                    if ($p.hasClass('custom-control')) {
                        $p.addClass('is-invalid');
                        $p.siblings('.invalid-feedback').text(data.errors[prop][0]);
                    }
                    $i.addClass('is-invalid');
                    $i.siblings('.invalid-feedback').text(data.errors[prop][0]);
                }
                if ($f.data('scroll-top')) {
                    $([document.documentElement, document.body]).animate({
                        scrollTop: $f.offset().top
                    }, 500);
                }
            }

        },
        'error': function (xhr, statusText, errorText) {
            alert('Server error: ' + xhr.status);
        },
        'complete': function () {
            ajax_form_complete($f);
        }
    });
}

function ajax_form_init($f) {
    const f = $f.get(0);
    if (typeof f.before_ajax_submit === 'function') {
        if (!f.before_ajax_submit()) {
            return false;
        }
    }
    $f.find('.invalid-feedback').text('');
    $f.find('.is-invalid').removeClass('is-invalid');
    $f.find(':submit').prop('disabled', true).append(' <i class="fa fa-spinner fa-spin"></i>');
    $(document).find('[data-submit="' + $f.attr('id') + '"]').addClass('disabled');
    $f.find('[data-form-result]').hide();
    $f.find('[data-form-errors]').hide();
    return true;
}

function ajax_form_complete($f) {
    $f.find(':submit').prop('disabled', false).find('.fa-spin').remove();
    $(document).find('[data-submit="' + $f.attr('id') + '"]').removeClass('disabled');
}


function updateUrlParameter(uri, key, value) {
    // remove the hash part before operating on the uri
    var i = uri.indexOf('#');
    var hash = i === -1 ? '' : uri.substr(i);
    uri = i === -1 ? uri : uri.substr(0, i);

    var re = new RegExp("([?&])" + escapeRegExp(key) + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
        uri = uri.replace(re, '$1' + key + "=" + value + '$2');
    } else {
        uri = uri + separator + key + "=" + value;
    }
    return uri + hash;  // finally append the hash as well
}

