zip -r server.zip .
aws lambda update-function-code --function-name marcin-do-not-remove-pls --zip-file fileb://server.zip --publish --region eu-west-1
rm server.zip