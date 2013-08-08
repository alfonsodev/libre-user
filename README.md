#libre user

#Security
	Cookies
		Only one cookie is used to store the SESSION_ID, with these security messures:
			* HttpOnly flag enabled, in modern browsers make no posible to access session id via javascript.
				HttpOnly restricts all access to document.cookie in IE7, Firefox 3, and Opera 9.5 (unsure about Safari)
				HttpOnly removes cookie information from the response headers in XMLHttpObject.getAllResponseHeaders() in IE7. It should do the same thing in Firefox, but it doesn't, because there's a bug.
				XMLHttpObjects may only be submitted to the domain they originated from, so there is no cross-domain posting of the cookies.

			* SESSION_ID length is more than 128 bit.
			* SESSION_ID is invalidated on LOG OUT

