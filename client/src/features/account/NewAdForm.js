import React, { useCallback, useState } from "react";
import Layout from "../../components/Layout";
import { Formik } from "formik";
import { DUMMY_CATEGORIES } from "../../components/Categories";
import { useDropzone } from "react-dropzone";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "./userSlice";
import { useCreateAdMutation, useGetSingleAdMutation } from "../ads/adApiSlice";
import * as yup from "yup";
import { storage } from "../../firebase";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import LoadingModal from "../../components/UI/LoadingModal";
import { adActions } from "../ads/adSlice";

const NewAdForm = () => {
  const user = useSelector(selectUser);
  const [imgCounter, setImgCounter] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formPhotos, setFormPhotos] = useState([]);
  const [values, setValues] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    city: user.city ? user.city : "",
    formEmail: user.email,
    phone: user.phone ? user.phone : "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [createAd] = useCreateAdMutation();
  const [getSingleAd] = useGetSingleAdMutation();

  const refresh = () => {
    window.location.reload();
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    onDrop: useCallback(
      (acceptedFiles) => {
        if (imgCounter + acceptedFiles.length > 8) {
          alert("Maksymalna liczba zdjęć to 8");
          return;
        } else {
          setImgCounter(imgCounter + acceptedFiles.length);
        }
        setFormPhotos([
          ...formPhotos,
          ...acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
          ),
        ]);
      },
      [formPhotos, imgCounter]
    ),
  });

  const handleChangeValue = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleDeletePhoto = (index) => {
    const newPhotos = formPhotos.filter((photo, i) => i !== index);
    setFormPhotos(newPhotos);
  };

  const handleChangePhotoPosition = (index, direction) => {
    const newPhotos = [...formPhotos];
    const photoToMove = newPhotos[index];
    newPhotos.splice(index, 1);
    if (direction === "left") {
      newPhotos.splice(index - 1, 0, photoToMove);
    } else {
      newPhotos.splice(index + 1, 0, photoToMove);
    }
    setFormPhotos(newPhotos);
  };

  const uploadPhotos = async (adId) => {
    return await Promise.all(
      formPhotos.map(async (photo) => {
        const photoRef = ref(storage, `ads/${adId}/${photo.lastModified}`);
        return await uploadBytes(photoRef, photo, "data_url")
          .then(() => {
            const downloadURL = getDownloadURL(photoRef);
            return downloadURL;
          })
          .catch((error) => {
            console.log(error);
          });
      })
    );
  };

  const phoneRegex = /^[0-9]{9}$/;

  const validationSchema = yup.object({
    title: yup
      .string()
      .trim()
      .required("Wprowadź tytuł ogłoszenia")
      .min(5, "Tytuł ogłoszenia powinien mieć długość co najmniej 5 znaków")
      .max(80, "Tytuł ogłoszenia powinien zawierać nie więcej niż 80 znaków"),
    description: yup
      .string()
      .trim()
      .required("Pole wymagane")
      .min(10, "Opis powinien zawierać co najmniej 10 znaków")
      .max(3000, "Opis powinien zawierać nie więcej niż 3000 znaków"),
    price: yup
      .number()
      .min(0, "Cena powinna zaczynać się od 0")
      .required("Pole wymagane"),
    category: yup.string().required("Pole wymagane"),
    city: yup
      .string()
      .required("Pole wymagane")
      .min(2, "Nazwa miasta jest za krótka")
      .max(30, "Nazwa miasta jest za długa"),
    photos: yup.array().min(1, "Dodaj przynajmniej jedno zdjęcie"),
    phone: yup
      .string()
      .trim()
      .required("Pole wymagane")
      .matches(phoneRegex, "Nieprawidłowy numer telefonu"),
    formEmail: yup
      .string()
      .trim()
      .required("Pole wymagane")
      .email("Nieprawidłowy email"),
  });

  return (
    <Layout>
      <div className="flex flex-col bg-white w-full mb-6">
        <div className="text-black font-bold text-4xl mb-6">
          Dodaj ogłoszenie
        </div>
        <Formik
          initialValues={{
            ...values,
            photos: formPhotos,
          }}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            setIsLoading(true);
            const adId = uuidv4();

            try {
              const photosUrls = await uploadPhotos(adId);
              await createAd({
                email: user.email,
                adId: adId,
                ad: {
                  ...values,
                },
                photos: photosUrls,
              });

              try {
                const { data } = await getSingleAd({ id: adId });
                dispatch(adActions.addUserAd(data[0]));
              } catch (error) {
                console.log(error);
              }

              navigate("/user/account");
              refresh();
            } catch (error) {
              console.log(error);
            }
            setIsLoading(false);
          }}
        >
          {({ values, handleSubmit, isSubmitting, setFieldValue, errors }) => (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {isLoading && <LoadingModal />}
              <div className="flex flex-col bg-lightWheat gap-2 p-8">
                <label htmlFor="title" className="text-sm">
                  Tytuł*
                </label>
                <input
                  className="p-4 bg-white focus:ring-2 focus:ring-darkGreen focus:outline-none"
                  type="text"
                  name="title"
                  onChange={handleChangeValue}
                  value={values.title}
                  placeholder="np. iPhone 11"
                />
                {errors.title && (
                  <div className="text-red-500">{errors.title}</div>
                )}
                <label htmlFor="category" className="text-sm">
                  Kategoria*
                </label>
                <select
                  name="category"
                  id="category"
                  onChange={handleChangeValue}
                  value={values.category}
                  className="bg-white p-4 w-max focus:ring-2 focus:ring-darkGreen focus:outline-none"
                >
                  <option value="">Wybierz kategorię</option>
                  {DUMMY_CATEGORIES.map((category) => (
                    <option key={category.id} value={category.cat}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <div className="text-red-500">{errors.category}</div>
                )}
              </div>
              <div className="flex flex-col bg-lightWheat gap-2 p-8">
                <h3 className="font-bold text-2xl">Zdjęcia</h3>
                <p className="text-sm">
                  Pierwsze zdjęcie będzie zdjęciem głównym.
                </p>
                <div className="" {...getRootProps()}>
                  <input
                    {...getInputProps()}
                    name="photos"
                    onChange={handleChangeValue}
                  />
                  <p className="p-4 border-dashed border-2 border-black">
                    Drag and drop here
                  </p>
                </div>
                <ul className="flex flex-row flex-wrap gap-2 justify-center">
                  {values.photos.map((photo, index) => {
                    return (
                      <li
                        className="relative h-48 w-48 bg-white rounded-xl flex flex-row"
                        key={photo.lastModified}
                      >
                        <img
                          alt={photo.name}
                          src={photo.preview}
                          className="max-h-48 max-w-48 self-center aspect-auto rounded-xl m-auto"
                          onLoad={() => {
                            URL.revokeObjectURL(photo.preview);
                          }}
                        />
                        <div className="absolute top-36 left-20 pt-2 pr-4 z-1 flex flex-row gap-1">
                          <button
                            className={`bg-darkGreen rounded-md p-1 shadow-md`}
                            disabled={index === 0}
                            onClick={() =>
                              handleChangePhotoPosition(index, "left")
                            }
                            type="button"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6 text-white"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                              />
                            </svg>
                          </button>
                          <button
                            className={`bg-darkGreen rounded-md p-1 shadow-md`}
                            disabled={index === values.photos.length - 1}
                            onClick={() =>
                              handleChangePhotoPosition(index, "right")
                            }
                            type="button"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6 text-white"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                              />
                            </svg>
                          </button>
                          <button
                            className="bg-red-500 rounded-md p-1 shadow-md"
                            onClick={() => handleDeletePhoto(index)}
                            type="button"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                              />
                            </svg>
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                {errors.photos && (
                  <div className="text-red-500">{errors.photos}</div>
                )}
              </div>

              <div className="flex flex-col bg-lightWheat gap-2 p-8">
                <label htmlFor="description" className="text-sm">
                  Opis*
                </label>
                <textarea
                  className="p-4 bg-white focus:ring-2 focus:ring-darkGreen focus:outline-none"
                  name="description"
                  id="description"
                  cols="30"
                  rows="10"
                  onChange={handleChangeValue}
                  value={values.description}
                  placeholder="Wpisz informacje o produkcie, który chcesz sprzedać."
                ></textarea>
                {errors.description && (
                  <div className="text-red-500">{errors.description}</div>
                )}
              </div>
              <div className="flex flex-col bg-lightWheat gap-2 p-8">
                <label htmlFor="location" className="text-sm">
                  Lokalizacja*
                </label>
                <input
                  className="p-4 bg-white focus:ring-2 focus:ring-darkGreen focus:outline-none"
                  type="text"
                  name="city"
                  onChange={handleChangeValue}
                  value={values.city}
                  placeholder="Warszawa"
                />
                {errors.city && (
                  <div className="text-red-500">{errors.city}</div>
                )}
              </div>
              <div className="flex flex-col bg-lightWheat gap-2 p-8">
                <h1 className="font-bold text-3xl">Dane kontaktowe</h1>
                <label htmlFor="email" className="text-sm">
                  Email*
                </label>
                <input
                  className="p-4 bg-white focus:ring-2 focus:ring-darkGreen focus:outline-none"
                  type="email"
                  name="formEmail"
                  onChange={handleChangeValue}
                  value={values.formEmail}
                />
                {errors.formEmail && (
                  <div className="text-red-500">{errors.formEmail}</div>
                )}
                <label htmlFor="phone" className="text-sm">
                  Telefon*
                </label>
                <input
                  className="p-4 bg-white focus:ring-2 focus:ring-darkGreen focus:outline-none"
                  type="text"
                  name="phone"
                  onChange={handleChangeValue}
                  value={values.phone}
                />
                {errors.phone && (
                  <div className="text-red-500">{errors.phone}</div>
                )}
              </div>
              <div className="flex flex-col bg-lightWheat gap-2 p-8">
                <label htmlFor="price" className="text-sm">
                  Cena*
                </label>
                <input
                  className="p-4 bg-white focus:ring-2 focus:ring-darkGreen focus:outline-none"
                  type="number"
                  name="price"
                  onChange={handleChangeValue}
                  value={values.price}
                  min="0"
                />
                {errors.price && (
                  <div className="text-red-500">{errors.price}</div>
                )}
              </div>
              <div className="flex flex-col bg-lightWheat gap-2 px-8 py-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-green font-bold text-white p-4 shadow-xl self-end border-4 border-green hover:border-darkGreen"
                >
                  Dodaj ogłoszenie
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </Layout>
  );
};

export default NewAdForm;
