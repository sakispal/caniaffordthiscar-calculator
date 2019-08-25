// JavaScript Document

$(document).ready(function(){
		// Lightbox popup
		$(document).delegate('*[data-gallery="navigateTo"]', 'click', function(event) {
			event.preventDefault();
			return $(this).ekkoLightbox({
				onShown: function() {
					var a = this.modal_content.find('.modal-footer a');
					if(a.length > 0) {
	
						a.click(function(e) {
	
							e.preventDefault();
							this.navigateTo(2);
	
						}.bind(this));
					}
				}
			});
		});
	});