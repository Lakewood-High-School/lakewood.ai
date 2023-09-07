printf "Creating configuration file symlink"
ln -s `pwd`/lakewood.ai.conf /etc/apache2/sites-enabled/lakewood.ai.conf
if [ $? -eq 0 ]; then
	echo " [DONE]"
else
	echo " [ERROR]"
fi
echo "Completed setup"