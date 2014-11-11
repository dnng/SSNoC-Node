function init() {
	$('#tbl_announcements').DataTable({
		  "searching": false
	});
	$('#tbl_users').DataTable({
		  "searching": false
	});
}

$(document).on('ready', init);
