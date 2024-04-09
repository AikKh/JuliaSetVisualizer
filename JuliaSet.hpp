#include <SFML/Graphics.hpp>
#include <iostream>
#include <fstream>
#include <cmath>

#define ZOOM_SPEED 5 // Works in reverse
#define MOVE_SPEED 500

class JuliaSet {
public:
    JuliaSet(int width, int height, sf::RenderWindow& win) : width(width), height(height), window(win)
    { 
        real_beg = -1.0f;
        real_end = 1.0f;
        imag_beg = -1.0f;
        imag_end = 1.0f;

        initiate(width, height);
    }

    void run()
    {
        while (window.isOpen())
        {
            sf::Event event;

            while (window.pollEvent(event))
            {
                if (event.type == sf::Event::Closed)
                    window.close();

                // Zoomin and dezooming
                if (event.type == sf::Event::MouseWheelScrolled) {
                    int dir = event.mouseWheelScroll.delta;

                    zoom(dir);

                    updateScale();
                    updateShader();
                }

                // Start moving
                if (event.type == sf::Event::MouseButtonPressed && event.mouseButton.button == sf::Mouse::Left) {
                    sf::Vector2i mousePosition = sf::Mouse::getPosition(window);
                    sf::Vector2f worldMousePosition = window.mapPixelToCoords(mousePosition);

                    _prevCord = convertToComplex(worldMousePosition);
                }

                /*else if (event.type == sf::Event::MouseButtonPressed && event.mouseButton.button == sf::Mouse::Left) {
                    _prevCord = sf::Vector2f(0, 0);
                }*/

                // Moving
                if (sf::Mouse::isButtonPressed(sf::Mouse::Left)) {
                    sf::Vector2i mousePosition = sf::Mouse::getPosition(window);
                    sf::Vector2f worldMousePosition = window.mapPixelToCoords(mousePosition);

                    sf::Vector2f pos = convertToComplex(worldMousePosition);

                    if (pos != _prevCord)
                    {
                        auto dir = sf::Vector2f(_prevCord.x - pos.x, pos.y - _prevCord.y);
                        move(dir);
                        updateShader();
                        _prevCord = pos;
                    }
                }

                // Changing constant based on mouse position
                if (sf::Mouse::isButtonPressed(sf::Mouse::Right)) {
                    sf::Vector2i mousePosition = sf::Mouse::getPosition(window);
                    sf::Vector2f worldMousePosition = window.mapPixelToCoords(mousePosition);

                    sf::Vector2f pos = convertToComplex(worldMousePosition);

                    shader.setUniform("constant", pos);
                }
            }

            // Incrementing amount of iterations on space
            if (sf::Keyboard::isKeyPressed(sf::Keyboard::Space)) {
                shader.setUniform("iterations", ++iterations);
                std::cout << "Iterations: " << iterations << std::endl;
            }

            window.clear();
            window.draw(textureSprite, &shader);
            window.display();
        }
    }

private:

    sf::Vector2f convertToComplex(sf::Vector2f pos) const
    {
        float xf = pos.x / width;
        float yf = pos.y / height;

        xf = xf * 2 - 1.0f;
        yf = yf * 2 - 1.0f;

        return sf::Vector2f(xf, yf);
    }

    void initiate(int width, int height) 
    {
        window.setFramerateLimit(60);
        window.setKeyRepeatEnabled(false);

        shader.loadFromFile("Julia.frag", sf::Shader::Fragment);
        shader.setUniform("resolution", sf::Vector2f(width, height));
        shader.setUniform("aspect", (float)width / height);

        shader.setUniform("constant", sf::Vector2f(0.345f, -0.0575f));
        shader.setUniform("iterations", iterations);

        updateScale();
        updateShader();

        texture.create(width, height);
        textureSprite = sf::Sprite(texture.getTexture());
    }

    void updateScale()
    {
        scale = sf::Vector2f((real_end - real_beg) / (width), (imag_end - imag_beg) / (height));
    }

    void zoom(int in)
    {
        float zoomFactor = 1.0f - static_cast<float>(in) / ZOOM_SPEED;
        float realRange = real_end - real_beg;
        float imagRange = imag_end - imag_beg;

        float newRealRange = realRange * zoomFactor;
        float newImagRange = imagRange * zoomFactor;

        float realCenter = (real_beg + real_end) / 2.0f;
        float imagCenter = (imag_beg + imag_end) / 2.0f;

        real_beg = realCenter - newRealRange / 2.0f;
        real_end = realCenter + newRealRange / 2.0f;
        imag_beg = imagCenter - newImagRange / 2.0f;
        imag_end = imagCenter + newImagRange / 2.0f;
    }

    void move(sf::Vector2f dir)
    {
        real_beg += dir.x * scale.x * MOVE_SPEED;
        real_end += dir.x * scale.x * MOVE_SPEED;
        imag_beg += dir.y * scale.y * MOVE_SPEED;
        imag_end += dir.y * scale.y * MOVE_SPEED;
    }

    void updateShader()
    {
        shader.setUniform("real_beg", real_beg);
        shader.setUniform("real_end", real_end);
        shader.setUniform("imag_beg", imag_beg);
        shader.setUniform("imag_end", imag_end);
    }

private:
    int width, height;
    int iterations = 20;

    sf::RenderWindow& window;
    sf::Shader shader;
    sf::RenderTexture texture;
    sf::Sprite textureSprite;

    float real_beg, real_end, imag_beg, imag_end;
    sf::Vector2f scale;
    sf::Vector2f _prevCord;
};