import React, { useState } from 'react';
import './App.css';

const WebsiteBuilder = () => {
    const [elements, setElements] = useState([]);

    const handleDrop = (e, elementType) => {
        e.preventDefault();

        if (elementType === 'image') {
            handleImageUpload();
        } else {
            const newElement = createElement(elementType);
            setElements([...elements, newElement]);

        }

    };

    const createElement = (type) => {
        if (type === 'text') {
            return { id: Date.now(), type: 'text', content: 'Edit me', x: 0, y: 0 };
        } else if (type === 'image') {
            return { id: Date.now(), type: 'image', src: 'default-image-url.jpg', x: 0, y: 0 };
        }
        return null;
    };

    const handleEdit = (id, content) => {
        const updatedElements = elements.map((element) =>
            element.id === id ? { ...element, content } : element
        );
        setElements(updatedElements);
    };

    const handleImageChange = (id, src) => {
        const updatedElements = elements.map((element) =>
            element.id === id ? { ...element, src } : element
        );
        setElements(updatedElements);
    };

    const handleImageUpload = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';

        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (readerEvent) => {
                    const newSrc = readerEvent.target.result;
                    const newElement = { id: Date.now(), type: 'image', src: newSrc, x: 0, y: 0 };
                    setElements([...elements, newElement]);
                };
                reader.readAsDataURL(file);
            }
        };

        input.click();
    };

    const handleDragStart = (e, id) => {
        e.dataTransfer.setData('text/plain', id.toString());
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDropOnCanvas = (e) => {
        e.preventDefault();
        const draggedId = parseInt(e.dataTransfer.getData('text/plain'));
        const draggedElement = elements.find((element) => element.id === draggedId);

        if (draggedElement) {
            const canvas = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - canvas.left;
            const y = e.clientY - canvas.top;

            const updatedElements = elements.map((element) =>
                element.id === draggedId ? { ...element, x, y } : element
            );

            setElements(updatedElements);
        }
    };


    const handleImageDragStart = (e, id) => {
        e.dataTransfer.setData('text/plain', id.toString());
    };

    const handleImageDrop = (e) => {
        e.preventDefault();

        const draggedId = parseInt(e.dataTransfer.getData('text/plain'));
        const draggedElement = elements.find((element) => element.id === draggedId);

        if (draggedElement && draggedElement.type === 'image') {
            const x = e.clientX - e.currentTarget.getBoundingClientRect().left - e.nativeEvent.offsetX;
            const y = e.clientY - e.currentTarget.getBoundingClientRect().top - e.nativeEvent.offsetY;

            const updatedElements = elements.map((element) =>
                element.id === draggedId ? { ...element, x, y } : element
            );

            setElements(updatedElements);

        }

    };


    const handleSave = () => {
        try {
            const elementsString = JSON.stringify(elements);
            localStorage.setItem('savedElements', elementsString);
            console.log('Elements saved successfully:', elements);
        } catch (error) {
            console.error('Error saving elements to local storage:', error);
        }
    };

    return (
        <div className="website-builder-container">
            <div className="toolbar">
                <button
                    className="toolbar-button"
                    onClick={(e) => handleDrop(e, 'text')}
                    draggable
                    onDragStart={(e) => handleDragStart(e, Date.now())}
                >
                    Add Text
                </button>
                <button
                    className="toolbar-button"
                    onClick={(e) => handleDrop(e, 'image')}
                    draggable
                    onDragStart={(e) => handleImageDragStart(e, Date.now())}
                >
                    Add Image
                </button>
            </div>
            <div
                className="canvas"
                onDrop={handleDropOnCanvas}
                onDragOver={handleDragOver}
                onDragEnter={handleDragOver}
            >
                {elements.map((element) => (
                    <div
                        key={element.id}
                        className={`element-container ${element.type}-element`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, element.id)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDropOnCanvas}
                    >
                        {element.type === 'text' && (
                            <div
                                className="text-element"
                                contentEditable
                                onBlur={(e) => handleEdit(element.id, e.target.innerText)}
                                dangerouslySetInnerHTML={{ __html: element.content }}
                            />
                        )}
                        {element.type === 'image' && (
                            <img
                                src={element.src}
                                alt="User's Uploaded Content"
                                className="image-element"
                                draggable
                                onDragStart={(e) => handleImageDragStart(e, element.id)}
                                onDrop={handleImageDrop}
                                onDragOver={(e) => e.preventDefault()}
                                onClick={() => {
                                    const newSrc = prompt('Enter new image URL:');
                                    if (newSrc) handleImageChange(element.id, newSrc);
                                }}
                            />
                        )}
                    </div>
                ))}
            </div>
            <button className="save-button" onClick={handleSave}>
                Save
            </button>
        </div>
    );
};

export default WebsiteBuilder;

