import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerContainer: {
    flexDirection: 'row', // ✅ Deixa o título e botão de logout lado a lado
    alignItems: 'center', // ✅ Alinha os itens verticalmente
    justifyContent: 'space-between', // ✅ Espaço entre o título e o botão de logout
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff', // ✅ Mantém o fundo branco para o header
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  listWrapper: {
    flex: 1,
  },
  postContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0056b3',
    marginBottom: 6,
  },
  postDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
    lineHeight: 20,
  },
  postTheme: {
    fontSize: 12,
    color: '#777',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  readMoreButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  readMoreText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  noPostsText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#777',
  },
  footerContainer: {
    height: 60,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    width: '100%',
    flexShrink: 0,
  },

  /** 🔴 ESTILOS PARA O BOTÃO DE LOGOUT 🔴 **/
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default styles;


