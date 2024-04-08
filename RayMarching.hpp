#include <SFML/Graphics.hpp>
#include <iostream>
#include <fstream>
#include <cmath>

class RayMarching {

public:
    RayMarching(int width, int height, sf::RenderWindow& win) : window(win) { initiate(width, height); }

    void run()
    {
        int t = 0;

        while (window.isOpen())
        {
            t++;
            sf::Event event;

            while (window.pollEvent(event))
            {
                if (event.type == sf::Event::Closed)
                    window.close();

                if (event.type == sf::Event::TextEntered)
                {
                    if (event.text.unicode < 128)
                        std::cout << "ASCII character typed: " << static_cast<char>(event.text.unicode) << std::endl;
                }

                if (event.type == sf::Event::KeyPressed)
                {
                    if (event.key.code == sf::Keyboard::Escape)
                    {
                        std::cout << "the escape key was pressed" << std::endl;
                        std::cout << "control:" << event.key.control << std::endl;
                        std::cout << "alt:" << event.key.alt << std::endl;
                        std::cout << "shift:" << event.key.shift << std::endl;
                        std::cout << "system:" << event.key.system << std::endl;
                    }
                }
            }

            float s = (float)sin(t * 0.01);
            light = sf::Vector3f(-2, s * 2, s * 2);
            shader.setUniform("light", light);
            //shader.setUniform("_sphere", sf::Vector3f(sphere.x, sphere.y * s * 2, sphere.z));
            //shader.setUniform("cameraDir", s * cameraDir);
            //shader.setUniform("blue", (float)((std::sin((float)t * 0.01) + 1) / 2));

            window.clear();
            window.draw(textureSprite, &shader);
            window.display();
        }
    }

private:
    // Camera and light setup
    sf::Vector3f camera = sf::Vector3f(-8.0f, 0.0f, 4.0f);
    sf::Vector2f cameraDir = sf::Vector2f(1, 1);
    sf::Vector3f light = sf::Vector3f(-2.0f, 0.0f, 6.0f);
    sf::Vector3f sphere = sf::Vector3f(0.0f, 0.0f, 0.0f);
    sf::RenderWindow& window;
    sf::Shader shader;
    sf::RenderTexture texture;
    sf::Sprite textureSprite;

    void initiate(int width, int height) {
        window.setFramerateLimit(60);
        window.setKeyRepeatEnabled(false);

        shader.loadFromFile("RayMarchingSphere.frag", sf::Shader::Fragment);
        //shader.setUniform("light", light);
        shader.setUniform("resolution", sf::Vector2f(width, height));
        shader.setUniform("aspect", (float)width / height);
        shader.setUniform("camera", camera);

        shader.setUniform("_sphere", sphere);
        shader.setUniform("radious", 1.0f);

        shader.setUniform("_cube", sf::Vector3f(0.0f, 3.0f, 0.0f));
        shader.setUniform("size", 1.0f);

        shader.setUniform("_plane", sf::Vector3f(0.0f, 0.0f, -10.0f));

        shader.setUniform("cameraDir", cameraDir);

        texture.create(width, height);
        textureSprite = sf::Sprite(texture.getTexture());
    }
};