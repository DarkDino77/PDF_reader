import { Button } from '../atoms/Button';

export const DocumentTable: React.FC = () => {
  const { documents, refresh } = useDocuments();

  return (
    <table className="w-full">
      {documents.map(doc => (
        <tr key={doc.id}>
          <td>{doc.name}</td>
          <td>
            <Button variant="danger" onClick={() => handleDelete(doc.id)}>Delete</Button>
          </td>
        </tr>
      ))}
    </table>
  );
};