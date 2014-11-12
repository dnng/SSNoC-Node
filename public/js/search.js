function init() {
	$('#tbl_announcements').DataTable({
		  "searching": false
	});
	$('#tbl_private_message').DataTable({
		  "searching": false
	});
	$('#tbl_public_message').DataTable({
		  "searching": false
	});
}

$(document).on('ready', init);
