function mailchimpSubscribe(url, email, fullName, lastName, prefix, honeyPot, callback) {
  var hiddenIFrame = document.createElement('iframe');
  hiddenIFrame.style.position = 'absolute';
  hiddenIFrame.style.left = '-5000px';
  hiddenIFrame.style.visibility = 'hidden';

  var hiddenForm = document.createElement('form');
  hiddenForm.setAttribute("action", url);
  hiddenForm.setAttribute("method", "post");
 
  var body = [
    ['EMAIL', email],
    ['NAME', fullName],
    ['LNAME', lastName],
    ['PREFIX', prefix],
    [honeyPot, ''],
  ];

  body.forEach(function (el) {
    var key = el[0];
    var value = el[1];
    var hiddenInput = document.createElement('input');
    hiddenInput.setAttribute('name', key);
    hiddenInput.setAttribute('value', value);
    hiddenInput.setAttribute('type', 'hidden');
    hiddenForm.appendChild(hiddenInput);
  });

  document.body.appendChild(hiddenIFrame);
  hiddenIFrame.contentDocument.body.appendChild(hiddenForm);

  hiddenIFrame.addEventListener('load', function () {
    callback(null);
  });
  hiddenIFrame.addEventListener('error', function (err) {
    callback(err);
  });
  hiddenForm.submit();
}
