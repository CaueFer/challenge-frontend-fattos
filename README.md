# Challeng Fattocs (frontend)

Este desafio técnico consiste é um sistema de gerenciamento de tarefas desenvolvido com [Next.js](https://nextjs.org) e utiliza uma base de dados para armazenar as informações das tarefas. As funcionalidades incluem listar, adicionar, editar, excluir e reordenar tarefas, conforme descrito abaixo.

## Visualização do Projeto

Você pode acessar o projeto no link:
👉 [Challenge Fattos](https://frontend-fattos.vercel.app)

## Funcionalidades

### Lista de Tarefas
A página principal exibe todas as tarefas registradas no sistema. As tarefas são apresentadas em uma lista, e a ordem de apresentação é baseada em um campo numérico não repetido chamado `Ordem de Apresentação`. 

**Regras de Exibição:**
- Todas as tarefas, exceto o campo `Ordem de Apresentação`, devem ser apresentadas.
- As tarefas com custo maior ou igual a R$1.000,00 são destacadas com um fundo amarelo.
- Cada tarefa exibe dois botões de ação:
  - **Editar**: Permite editar o nome, custo e data limite da tarefa.
  - **Excluir**: Remove a tarefa com uma confirmação do usuário.

### Excluir Tarefa
A função de exclusão permite remover uma tarefa específica do sistema. Ao clicar no botão de exclusão, uma mensagem de confirmação "Sim/Não" aparece para evitar exclusões acidentais.

### Editar Tarefa
Permite editar uma tarefa existente. Os campos editáveis são:
- **Nome da Tarefa**
- **Custo**
- **Data Limite**

**Validações:**
- Verifica se o novo nome da tarefa já existe no banco de dados. Se existir, impede a atualização.
- A edição pode ser feita diretamente na página principal ou em uma janela modal, conforme preferência.

### Incluir Tarefa
A função de inclusão permite adicionar novas tarefas. O usuário insere:
- Nome da Tarefa
- Custo
- Data Limite

**Nota:** O campo `Ordem de Apresentação` é gerado automaticamente e define a tarefa como última na lista. Não podem existir duas tarefas com o mesmo nome.

### Reordenar Tarefas
É possível reordenar a lista de tarefas de duas formas:
1. **Drag-and-Drop**: O usuário arrasta a tarefa para uma nova posição na lista.
2. **Botões de Subir/Descer**: Cada tarefa apresenta dois botões para ajustar sua posição. As restrições são:
   - A primeira tarefa não pode ser movida para cima.
   - A última tarefa não pode ser movida para baixo.

## Tecnologias Utilizadas

- **Next.js**: Framework principal para a criação do frontend.
- **Nestjs & Postgres**: Base de dados para armazenar as tarefas, garantindo persistência dos dados.
- **Tailwind**: Estilização da interface e personalização da exibição das tarefas destacadas.

## Conclusão

 **Portfólio**: Para mais projetos visite meu portfólio: https://c-dev.netlify.app
