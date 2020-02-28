mkdir __update_docs_temp
cd ./__update_docs_temp
mkdir service
git clone https://$GTTOKEN@github.com/surveyjs/service
cp -a ../docs/. ./service/surveyjs.io/App_Data/DocsAnalytics
cd ./service
git add ./surveyjs.io/App_Data/DocsAnalytics
git commit -m "Updated Analytics documentation"
git push
cd ../..
rm -rf __update_docs_temp
