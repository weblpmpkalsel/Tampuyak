awk '
  /@media print {/ {
    print $0
    print "    #root {"
    print "      display: none !important;"
    print "    }"
    print "    #print-root {"
    print "      display: block !important;"
    print "    }"
    found = 1
    next
  }
  {print $0}
' src/index.css > src/index.css.tmp
mv src/index.css.tmp src/index.css
echo "@media screen {" >> src/index.css
echo "  #print-root {" >> src/index.css
echo "    display: none !important;" >> src/index.css
echo "  }" >> src/index.css
echo "}" >> src/index.css
