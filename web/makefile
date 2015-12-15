build:
	- rm -rf dist
	mkdir dist
	jspm bundle-sfx --minify app/main dist/app.min.js
	./node_modules/.bin/html-dist index.html --remove-all --minify --insert app.min.js -o dist/index.html
	cp -r resources* dist/resources
	firebase deploy