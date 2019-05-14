cd packages
cd survey-pdf
printf "//registry.npmjs.org/:_authToken=${NPM_TOKEN}\n" >> ./.npmrc
npm publish .
