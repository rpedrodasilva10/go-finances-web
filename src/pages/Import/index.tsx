import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import alert from '../../assets/alert.svg';
import FileList from '../../components/FileList';
import Header from '../../components/Header';
import Upload from '../../components/Upload';
import api from '../../services/api';
import { Container, Footer, ImportFileContainer, Title } from './styles';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const history = useHistory();

  async function submitFile(): Promise<void> {
    const data = new FormData();

    data.append('file', uploadedFiles[0].file);

    try {
      await api.post('/transactions/import', data, {
        headers: {
          'Content-Type': `multipart/form-data;`,
        },
      });
    } catch (err) {
      console.log(err.response.error);
    }
  }

  function handleUpload(files: File[]): void {
    console.log('handleUpload');
    console.log(files);

    const returnedFileProps: FileProps[] = [];

    if (files) {
      files.map((file) => returnedFileProps.push({ file, name: file.name, readableSize: file.size.toString() }));

      setUploadedFiles([...uploadedFiles, ...returnedFileProps]);
    }
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={handleUpload} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={submitFile} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
