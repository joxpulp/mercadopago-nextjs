import { ICreateCardToken } from '../../hooks/useMercadoPago/interfaces';
import { useMercadoPago } from '../../hooks/useMercadoPago/useMercadoPago';
import MPFormField from './MPFormField/MPFormField';

function MPForm() {
  const config = {
    style: {
      color: '#000000',
      placeholderColor: '#D4D8E1'
    },
    placeholder: {
      cardNumber: '1234 1234 1234 1234',
      expirationDate: 'MM/YY',
      securityCode: 'Codigo CVV',
    },
  };
  const { idTypes, fieldData, createCardToken } = useMercadoPago(
    'TEST-12e0021e-da80-41e0-bf96-14d02ea8fe9c',
    config
  );

  const onSubmit = async () => {
    const token = (await createCardToken({
      cardholderName: 'pepe',
      identificationType: 'DNI',
      identificationNumber: '95216583',
    })) as ICreateCardToken;
    console.log(token);
  };

  const styles =
    'w-full border border-[#D4D8E1] h-[48px] px-[15px] py-[13px] rounded-[4px]';

  return (
    <div className="m-[20px] w-[50%] flex flex-col gap-[13px]">
      {/* Dado que estamos pasando como id 'cardNumber', en la prop de errorMessage
        pasamos el errorMessage correspondiente a ese id, y asi con cada campo */}
      <MPFormField
        id="cardNumber"
        label="Numero de tarjeta"
        focusState={fieldData.cardNumber.isFocus}
        errorMessage={fieldData.cardNumber.error}
      />
      <div className="flex gap-[13px]">
        <MPFormField
          id="expirationDate"
          label="Fecha de vencimiento"
          focusState={fieldData.expirationDate.isFocus}
          errorMessage={fieldData.expirationDate.error}
        />
        <MPFormField
          id="securityCode"
          label="Código CVC"
          focusState={fieldData.securityCode.isFocus}
          errorMessage={fieldData.securityCode.error}
        />
      </div>
      <div className="flex gap-[13px]">
        {/* Here we can use the custom select that we already have */}
        {idTypes && (
          <select className={styles} name="idTypes">
            {idTypes.map((id) => (
              <option key={id.id} value={id.id}>
                {id.name}
              </option>
            ))}
          </select>
        )}
        <input className={styles} type="text" />
      </div>
      <button
        onClick={onSubmit}
        className="rounded-md bg-green-400 p-[10px] w-fit"
      >
        Enviar Pago
      </button>
    </div>
  );
}

export default MPForm;
