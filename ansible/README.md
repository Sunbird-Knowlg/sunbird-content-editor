for provision
ansible-playbook -i inventory/{{file}} provision.yml       

for deploy
ansible-playbook -i inventory/{{file}} deploy.yml