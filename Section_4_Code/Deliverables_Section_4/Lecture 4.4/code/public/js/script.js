$(function() {
  const inputBox = $(".inputBox");
  const charCount = $("#characterCount");
  inputBox.on('keyup', function() {
    charCount.text(`${$(this).val().length} character(s)`)
  });
  console.log(document.cookie);
});