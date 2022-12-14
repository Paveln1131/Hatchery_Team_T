import React, { useState, useContext, useEffect } from 'react';
import { Button, Form, Alert, InputGroup } from 'react-bootstrap';
import styles from "../css/RequestForm.module.css"
import UserContext from "../UserProvider";
import { useNavigate } from 'react-router-dom';

export default function RequestForm() {
    const navigate = useNavigate();

    const phoneRegex = "[0-9]{9}";
    const ICRegex = "[0-9]{8}";
    const birthNumRegex = "[0-9/]{9,11}"

    const { calculatorData } = useContext(UserContext);

    if (calculatorData.amount) {
        const sessionStoragePayload = {
            amount: calculatorData.amount,
            numOfMonths: calculatorData.numOfMonths
        }
        sessionStorage.setItem("calcData", JSON.stringify(sessionStoragePayload));
    }

    const defaultForm = {
        applicantType: "",
        name: "",
        surname: "",
        birthNum: "",
        nationality: "",
        email: "",
        phone: "",
        IC: "",
        position: "",
        companyName: "",
        amount: JSON.parse(sessionStorage.getItem("calcData")).amount,
        numOfMonths: JSON.parse(sessionStorage.getItem("calcData")).numOfMonths,
        address: {
            street: "",
            descNumber: "",
            indicativeNumber: "",
            city: "",
            postalCode: ""
        }
    }

    const [formData, setFormData] = useState(defaultForm)
    const [validated, setValidated] = useState(false);
    const [applicantType, setApplicantType] = useState("")
    const [requestAddCall, setRequestAddCall] = useState({
        state: "inactive",
    })

    const setInputField = (key, value) => {
        const newData = {...formData};
        newData[key] = value;

        return setFormData(newData);
    }

    const setAddressInputField = (key, value) => {
        const newData = {...formData};
        newData.address[key] = value;

        return setFormData(newData);
    }

    useEffect(() => {
        if (requestAddCall.state === "success") {
            navigate("/clientPage/" + requestAddCall.data.id);
        }
    }, [requestAddCall, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const form = e.currentTarget;

        if (!form.checkValidity()) {
            setValidated(true);
        }

        const payload = {...formData}

        setRequestAddCall({ state: "pending" });
        fetch("/request/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload)
        }).then(async (response) => {
            const responseJson = await response.json();
            if (response.status >= 400) {
                setRequestAddCall({ state: "error", error: responseJson});        
            } else {
                setRequestAddCall({ state: "success", data: responseJson});
            }
        });
    }

  return (
    <div>
        <header>
            <h2>Formul???? k ????dosti o p??j??ku</h2>
        </header>
        <Form 
            className={styles.form}
            validated={validated}
            noValidate onSubmit={(e) => handleSubmit(e)}
        >
            <div className={styles.inputDivider}>
                <span className={styles.sectionNumber}>1</span>
            </div>
            <h4>Typ subjektu</h4>
            <Form.Group className={styles.inputGroup}>
                <Form.Select
                    className={styles.input}
                    value={formData.applicantType}
                    onChange={(e) => {
                        setFormData(defaultForm);
                        setInputField("applicantType", e.target.value)
                        setApplicantType(e.target.value)
                    }}
                    required
                >
                    <option 
                        value="" 
                        disabled
                        hidden
                    >
                        --- Vyberte typ subjektu ---
                    </option>
                    <option value="INDIVIDUAL">Fyzick?? osoba</option>
                    <option value="OSVC">Podnikaj??c?? fyzick?? osoba</option>
                    <option value="LEGAL_ENTITY">Pr??vnick?? osoba</option>
                </Form.Select>
            </Form.Group>

            <div className={styles.inputDivider}>
                <span className={styles.sectionNumber}>2</span>
            </div>
            <Form.Group className={styles.inputGroup}>
                <Form.Label className={styles.label}>K??estn?? jm??no</Form.Label>
                <Form.Control
                    className={styles.input}
                    type="text"
                    value={formData.name}
                    onChange={(e) => setInputField("name", e.target.value)}
                    required
                />
                <Form.Control.Feedback type="invalid">
                    Zadejte Va??e k??estn?? jm??no
                </Form.Control.Feedback>

                <Form.Label className={styles.label}>P????jmen??</Form.Label>
                <Form.Control
                    className={styles.input}
                    type="text"
                    value={formData.surname}
                    onChange={(e) => setInputField("surname", e.target.value)}
                    required
                />
                <Form.Control.Feedback type="invalid">
                    Zadejte Va??e p????jmen??
                </Form.Control.Feedback>
            </Form.Group>

            { applicantType === "INDIVIDUAL" ? (
                <Form.Group className={styles.inputGroup}>
                    <Form.Label className={styles.label}>Rodn?? ????slo</Form.Label>
                    <Form.Control
                        className={styles.input}
                        type="text"
                        value={formData.birthNum}
                        onChange={(e) => setInputField("birthNum", e.target.value.trim())}
                        maxLength={11}
                        pattern={birthNumRegex}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        Zadejte Va??e rodn?? ????slo
                    </Form.Control.Feedback>
                </Form.Group>
            ) : null }

            { applicantType === "OSVC" ? (
                <Form.Group className={styles.inputGroup}>
                    <Form.Label className={styles.label}>I??O</Form.Label>
                    <Form.Control
                        className={styles.input}
                        type="text"
                        value={formData.IC}
                        onChange={(e) => setInputField("IC", e.target.value.trim())}
                        pattern={ICRegex}
                        maxLength={8}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        Zadejte Va??e I??O
                    </Form.Control.Feedback>
                </Form.Group>
            ) : null }

            { applicantType === "LEGAL_ENTITY" ? (
                <Form.Group className={styles.inputGroup}>
                    <Form.Label className={styles.label}>N??zev spole??nosti</Form.Label>
                    <Form.Control
                        className={styles.input}
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => setInputField("companyName", e.target.value)}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        Zadejte n??zev Va???? spole??nosti
                    </Form.Control.Feedback>

                    <Form.Label className={styles.label}>I??O</Form.Label>
                    <Form.Control
                        className={styles.input}
                        type="text"
                        value={formData.IC}
                        onChange={(e) => setInputField("IC", e.target.value.trim())}
                        pattern={ICRegex}
                        maxLength={8}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        Zadejte Va??e I??O
                    </Form.Control.Feedback>

                    <Form.Label className={styles.label}>Pozice</Form.Label>
                        <Form.Select
                            className={styles.input}
                            value={formData.position}
                            onChange={(e) => setInputField("position", e.target.value)}
                            required
                        >
                        <option>??lenka p??edstavenstva</option>
                        <option>??lenka spr??vn?? rady</option>
                        <option>??lenka v??boru</option>
                        <option>??len p??edstavenstva</option>
                        <option>??len pspr??vn?? rady</option>
                        <option>??len v??boru</option>
                        <option>ekonom</option>
                        <option>ekonomka</option>
                        <option>gener??ln?? ??editel</option>
                        <option>gener??ln?? ??editelka</option>
                        <option>jednatel</option>
                        <option>jednatelka</option>
                        <option>m??stop??edseda</option>
                        <option>m??stop??edsedkyn??</option>
                        <option>m??stostarosta</option>
                        <option>m??stostarostka</option>
                        <option>p??edseda</option>
                        <option>p??edseda p??edstavenstva</option>
                        <option>p??edseda spr??vn?? rady</option>
                        <option>p??edsedkyn??</option>
                        <option>p??edsedkyn?? p??edstavenstva</option>
                        <option>p??edsedkyn?? spr??vn?? rady</option>
                        <option>prim??tor</option>
                        <option>prim??torka</option>
                        <option>prokurista</option>
                        <option>prokuristka</option>
                        <option>??editel</option>
                        <option>??editelka</option>
                        <option>spole??n??k</option>
                        <option>starosta</option>
                        <option>starostka</option>
                        <option>statut??rn?? ??editel</option>
                        <option>statut??rn?? ??editelka</option>
                        <option>????etn??</option>
                        <option>z??stupce</option>
                        <option>z??stupkyn??</option>
                        <option>zplnomocn??n??</option>
                        <option>zplnomocn??n??</option>
                    </Form.Select>
                </Form.Group>

            ) : (
                null
            ) }
            
            <Form.Group className={styles.inputGroup}>
                <Form.Label className={styles.label}>St??tn?? p????slu??nost</Form.Label>
                <Form.Control
                    className={styles.input}
                    type="text"
                    value={formData.nationality}
                    onChange={(e) => setInputField("nationality", e.target.value)}
                    required
                />
                <Form.Control.Feedback type="invalid">
                    Zadejte Va???? st??tn?? p????slu??nost
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className={styles.inputGroup}>
                <Form.Label className={styles.label}>E-mail</Form.Label>
                <Form.Control
                    className={styles.input}
                    type="email"
                    value={formData.email}
                    onChange={(e) => setInputField("email", e.target.value)}
                    required
                />
                <Form.Control.Feedback type="invalid">
                    Zadejte V???? E-mail
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className={styles.inputGroup}>
                <Form.Label className={styles.label}>Telefon</Form.Label>
                <InputGroup>
                <InputGroup.Text>+420</InputGroup.Text>
                    <Form.Control
                        className={styles.input}
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setInputField("phone", e.target.value.trim())}
                        pattern={phoneRegex}
                        maxLength={9}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        Zadejte V????e telefonn?? ????slo
                    </Form.Control.Feedback>
                </InputGroup>
            </Form.Group>

            <div className={styles.inputDivider}>
                <span className={styles.sectionNumber}>3</span>
            </div>
            { applicantType === "INDIVIDUAL" ? <h4>Adresa trval??ho pobytu</h4> : null}
            { applicantType === "OSVC" ? <h4>Adresa trval??ho pobytu</h4> : null}
            { applicantType === "LEGAL_ENTITY" ? <h4>Adresa s??dla</h4> : null}
            
            <Form.Group className={styles.inputGroup}>
                <Form.Label className={styles.label}>Ulice</Form.Label>
                <Form.Control
                    className={styles.input}
                    type="text"
                    value={formData.address.street}
                    onChange={(e) => setAddressInputField("street", e.target.value)}
                    required
                />
                <Form.Control.Feedback type="invalid">
                    Zadejte ulici
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className={styles.inputGroup}>
                <Form.Label className={styles.label}>????slo popisn??</Form.Label>
                <Form.Control
                    className={styles.input}
                    type="text"
                    value={formData.address.descNumber}
                    onChange={(e) => setAddressInputField("descNumber", parseInt(e.target.value))}
                    required
                />
                <Form.Control.Feedback type="invalid">
                    Zadejte ????slo popisn??
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className={styles.inputGroup}>
                <Form.Label className={styles.label}>????slo orienta??n??</Form.Label>
                <Form.Control
                    className={styles.input}
                    type="text"
                    value={formData.address.indicativeNumber}
                    onChange={(e) => setAddressInputField("indicativeNumber", parseInt(e.target.value))}
                    required
                />
                <Form.Control.Feedback type="invalid">
                    Zadejte ????slo orienta??n??
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className={styles.inputGroup}>
                <Form.Label className={styles.label}>M??sto</Form.Label>
                <Form.Control
                    className={styles.input}
                    type="text"
                    value={formData.address.city}
                    onChange={(e) => setAddressInputField("city", e.target.value)}
                    required
                />
                <Form.Control.Feedback type="invalid">
                    Zadejte m??sto
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className={styles.inputGroup}>
                <Form.Label className={styles.label}>PS??</Form.Label>
                <Form.Control
                    className={styles.input}
                    type="text"
                    value={formData.address.postalCode}
                    onChange={(e) => setAddressInputField("postalCode", parseInt(e.target.value))}
                    required
                />
                <Form.Control.Feedback type="invalid">
                    Zadejte po??tovn?? sm??rovac?? ????slo
                </Form.Control.Feedback>
            </Form.Group>

            <Button
                id={styles.submitButton}
                type="submit"
            >
                ODESLAT ????DOST
            </Button>
            { requestAddCall.error ? <Alert variant='danger'>Chybn?? vypln??n?? ????slo popisn??</Alert> : null }
        </Form>
    </div>
  )
}