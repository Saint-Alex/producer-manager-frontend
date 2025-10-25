import React from 'react';
import { Producer } from '../../../types/producer';
import { ActionButton } from '../../shared';
import {
  ListContainer,
  ProducerCard,
  ProducerInfo,
  ProducerActions
} from './ProducerList.styled';

interface ProducerListProps {
  producers: Producer[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onViewProperties?: (id: string) => void;
}

const ProducerList: React.FC<ProducerListProps> = ({
  producers,
  onEdit,
  onDelete,
  onViewProperties
}) => {
  return (
    <ListContainer>
      {producers.map((producer) => (
        <ProducerCard key={producer.id}>
          <ProducerInfo>
            <h3>{producer.nome}</h3>
            <p><strong>CPF/CNPJ:</strong> {producer.cpfCnpj}</p>
            <p><strong>Cadastrado em:</strong> {new Date(producer.createdAt).toLocaleDateString('pt-BR')}</p>
          </ProducerInfo>
          
          <ProducerActions>
            {onViewProperties && (
              <ActionButton
                variant="primary"
                size="small"
                onClick={() => onViewProperties(producer.id)}
              >
                Ver Propriedades
              </ActionButton>
            )}
            {onEdit && (
              <ActionButton
                variant="secondary"
                size="small"
                onClick={() => onEdit(producer.id)}
              >
                Editar
              </ActionButton>
            )}
            {onDelete && (
              <ActionButton
                variant="danger"
                size="small"
                onClick={() => onDelete(producer.id)}
              >
                Excluir
              </ActionButton>
            )}
          </ProducerActions>
        </ProducerCard>
      ))}
    </ListContainer>
  );
};

export default ProducerList;
