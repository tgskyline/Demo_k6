clear
rm log_lint.html
echo "Linter sendo executado..."
eslint  --o ./log_lint.html --fix
echo "Linter concluído!"
echo "Confira o arquivo log_lint.html para mais detalhes."
