<script>  Swal.fire({
					position: 'top-center',
					icon: 'info',
					title:'Anda Belum Login Silahkan Login dulu !!',
					showConfirmButton: true,
					  //timer: 1500
					}).then(function(){ 
					  window.location.replace('<?=base_urllogin?>');
					});
</script>