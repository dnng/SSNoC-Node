function init() {
	$('#tbl_announcements').DataTable({
		  "searching": false
	});
}

$(document).on('ready', init);
