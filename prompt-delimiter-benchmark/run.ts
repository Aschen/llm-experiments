import { writeFileSync, mkdirSync } from "node:fs";

import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";

mkdirSync("./prompts", { recursive: true });

const model = new OpenAI({
  modelName: "gpt-3.5-turbo-16k",
  temperature: 0.0,
  maxTokens: -1,
});

const bodyHTML = `<html><head></head><body>
<div>
  <div>
    <a href="https://roboflow.com/"><img src="https://blog.roboflow.com/assets/images/logo-4x.png?v=67f3b9dc62" alt="Roboflow"></a>
    
      <div>
        <div>Product</div>
        <div></div>
      </div>
      
    
    
      <div>
        <div>Solutions</div>
        <div></div>
      </div>
      
    
    
      <div>
        <div>Resources</div>
        <div></div>
      </div>
      
    
    <a href="https://roboflow.com/pricing">
      <div>Pricing</div>
    </a>
    <a href="https://docs.roboflow.com">
      <div>Docs</div>
    </a>
    <a href="https://meetings.salesloft.com/roboflow/meet-roboflow">Book a demo</a>
  </div>
  <div>
    <a href="https://app.roboflow.com">
      <div>Sign In</div>
    </a>
    <a href="https://app.roboflow.com">Sign Up</a>
    
      
        <div>
          <div></div>
          <div></div>
        </div>
      
      
    
  </div>
</div>

<div>
  <div>
    <div>
      
        <div>
          <div>Collections</div>
          <div></div>
        </div>
        
      
            <a href="/latest/">Latest Posts</a>
    <a href="/tag/tutorials/">Tutorials</a>
    <a href="/tag/case-studies/">Case Studies</a>
    <a href="/tag/product-updates/">Product Updates</a>
    <a href="/tag/greatest-hits/">Greatest Hits</a>
    <a href="/tags/">Categories</a>

    </div>
    <a href="#/search">
      <div></div>
      <div>Search</div>
    </a>
  </div>
  <div>
    
      <div>
        <div><a href="/tag/computer-vision/">Computer Vision</a>&nbsp;<a href="/tag/news/">News</a></div>
        <h1>First Impressions with GPT-4V(ision)</h1>
        <div>
          <div>
            <div>
              <a primary-author="url" href="/author/james/">
                <div></div>
              </a>
              <a primary-author="url" href="/author/skalskip/">
                <div></div>
              </a>
            </div>
            <div>
              <a href="https://blog.roboflow.com/author/james/">
                </a><div><a href="https://blog.roboflow.com/author/james/"></a><a href="/author/james/">James Gallagher</a>, <a href="/author/skalskip/">Piotr Skalski</a></div>
              
              <div>
                <div>Sep 27, 2023</div>
                <div></div>
                <div>9 min read</div>
              </div>
            </div>
          </div>
          <div>
            
              <div></div>
            
            
              <div></div>
            
            
              <div></div>
            
            
              <div></div>
            
          </div>
        </div>
      </div>
    
    <div></div>
  </div>
  
    <div>
      <div><img src="/content/images/size/w1000/2023/09/First-Impressions-with-GPT-4V-ision--Capabilities2.jpg" alt="" loading="lazy">
        
          <div>
            
              <div><p>On September 25th, 2023, <a href="https://help.openai.com/en/articles/6825453-chatgpt-release-notes?ref=blog.roboflow.com">OpenAI announced the rollout of two new features</a> that extend how people can interact with its recent and most advanced model, <a href="https://openai.com/research/gpt-4?ref=blog.roboflow.com">GPT-4</a>: the ability to ask questions about images and to use speech as an input to a query.</p><p>This functionality marks GPT-4’s move into being a <a href="https://blog.roboflow.com/multimodal-models/">multimodal model</a>. This means that the model can accept multiple “modalities” of input – text and images – and return results based on those inputs. Bing Chat, developed by Microsoft in partnership with OpenAI, and Google’s Bard model both support images as input, too. <a href="https://blog.roboflow.com/using-google-bard-with-images/">Read our comparison post to see how Bard and Bing perform with image inputs</a>.</p><p>In this guide, we are going to share our first impressions with the GPT-4V image input feature. We will run through a series of experiments to test the functionality of GPT-4V, showing where the model performs well and where it struggles.</p><p><em>Note: This article shows a limited series of tests our team performed; your results will vary depending on the questions you ask and the images you use in a prompt. Tag us on social media @roboflow with your findings using GPT-4V. We would love to see more tests using the model!</em></p><p>Without further ado, let’s get started!</p><h2>What is GPT-4V?</h2><p><a href="https://cdn.openai.com/papers/GPTV_System_Card.pdf?ref=blog.roboflow.com">GPT-4V(ision)</a> (GPT-4V) is a multimodal model developed by OpenAI. GPT-4V allows a user to upload an image as an input and ask a question about the image, a task type known as visual question answering (VQA).</p><p>GPT-4V is rolling out as of September 24th and will be available in both the OpenAI ChatGPT iOS app and the web interface. You must have a GPT-4 subscription to use the tool.</p><p>Let’s experiment with GPT-4V and test its capabilities!</p><h2>Test #1: Visual Question Answering</h2><p>One of our first experiments with GPT-4V was to inquire about a computer vision meme. We chose this experiment because it allows us to the extent to which GPT-4V understands context and relationships in a given image.</p><figure><img src="https://blog.roboflow.com/content/images/2023/09/2023-09-26-17.25.07-1.jpg" alt="" loading="lazy" width="590" height="1280"></figure><p>GPT-4V was able to successfully describe why the image was funny, making reference to various components of the image and how they connect. Notably, the provided meme contained text, which GPT-4V was able to read and use to generate a response. With that said, GPT-4V did make a mistake. The model said the fried chicken was labeled “NVIDIA BURGER” instead of “GPU”.</p><p>We then went on to test GPT-4V with currency, running a couple of different tests. First, we uploaded a photo of a United States penny. GPT-4V was able to successfully identify the origin and denomination of the coin:</p><figure><img src="https://blog.roboflow.com/content/images/2023/09/Screenshot-2023-09-26-at-19.36.14-1.png" alt="" loading="lazy" width="1258" height="1224" srcset="https://blog.roboflow.com/content/images/size/w600/2023/09/Screenshot-2023-09-26-at-19.36.14-1.png 600w, https://blog.roboflow.com/content/images/size/w1000/2023/09/Screenshot-2023-09-26-at-19.36.14-1.png 1000w, https://blog.roboflow.com/content/images/2023/09/Screenshot-2023-09-26-at-19.36.14-1.png 1258w" sizes="(min-width: 720px) 720px"></figure><p>We then uploaded an image with multiple coins and prompted GPT-4V with the text: “How much money do I have?”</p><figure><img src="https://blog.roboflow.com/content/images/2023/09/2023-09-26-17.56.29.jpg" alt="" loading="lazy" width="826" height="1280" srcset="https://blog.roboflow.com/content/images/size/w600/2023/09/2023-09-26-17.56.29.jpg 600w, https://blog.roboflow.com/content/images/2023/09/2023-09-26-17.56.29.jpg 826w" sizes="(min-width: 720px) 720px"></figure><p>GPT-4V was able to identify the number of coins but did not ascertain the currency type. With a follow up question, GPT-4V successfully identified the currency type:</p><figure><img src="https://blog.roboflow.com/content/images/2023/09/2023-09-26-18.00.56.jpg" alt="" loading="lazy" width="1179" height="939" srcset="https://blog.roboflow.com/content/images/size/w600/2023/09/2023-09-26-18.00.56.jpg 600w, https://blog.roboflow.com/content/images/size/w1000/2023/09/2023-09-26-18.00.56.jpg 1000w, https://blog.roboflow.com/content/images/2023/09/2023-09-26-18.00.56.jpg 1179w" sizes="(min-width: 720px) 720px"></figure><p>Moving on to another topic, we decided to try using GPT-4V with a photo from a popular movie: Pulp Fiction. We wanted to know: could GPT-4 answer a question about the movie without being told in text what movie it was?</p><p>We uploaded a photo from Pulp Fiction with the prompt “Is it a good movie?”, to which GPT-4V responded with a description of the movie and an answer to our question. GPT-4V provides a high-level description of the movie and a summary of the attributes associated with the movie considered to be positive and negative.</p><p>We further asked about the IMDB score for the movie, to which GPT-4V responded with the score as of January 2022. This suggests, like other GPT models released by OpenAI, there is a knowledge cutoff after which point the model has no more recent knowledge.</p><figure><img src="https://blog.roboflow.com/content/images/2023/09/2023-09-26-18.13.51.jpg" alt="" loading="lazy" width="1179" height="848" srcset="https://blog.roboflow.com/content/images/size/w600/2023/09/2023-09-26-18.13.51.jpg 600w, https://blog.roboflow.com/content/images/size/w1000/2023/09/2023-09-26-18.13.51.jpg 1000w, https://blog.roboflow.com/content/images/2023/09/2023-09-26-18.13.51.jpg 1179w" sizes="(min-width: 720px) 720px"></figure><p>We then explored GPT-4V’s question answering capabilities by asking a question about a place. We uploaded a photo of San Francisco with the text prompt “Where is this?” GPT-4V successfully identified the location, San Francisco, and noted that the Transamerica Pyramid, pictured in the image we uploaded, is a notable landmark in the city.</p><figure><img src="https://blog.roboflow.com/content/images/2023/09/Screenshot-2023-09-26-at-19.39.34.png" alt="" loading="lazy" width="764" height="714" srcset="https://blog.roboflow.com/content/images/size/w600/2023/09/Screenshot-2023-09-26-at-19.39.34.png 600w, https://blog.roboflow.com/content/images/2023/09/Screenshot-2023-09-26-at-19.39.34.png 764w" sizes="(min-width: 720px) 720px"></figure><p>Moving over to the realm of plants, we provided GPT-4V with a photo of a peace lily and asked the question “What is that plant and how should I care about it?”:</p><figure><img src="https://blog.roboflow.com/content/images/2023/09/2023-09-27-13.06.19.jpg" alt="" loading="lazy" width="711" height="1280" srcset="https://blog.roboflow.com/content/images/size/w600/2023/09/2023-09-27-13.06.19.jpg 600w, https://blog.roboflow.com/content/images/2023/09/2023-09-27-13.06.19.jpg 711w"></figure><p>The model successfully identified that the plant is a peace lily and provided advice on how to care for the plant. This illustrates the utility of having text and vision combined to create a multi-modal such as they are in GPT-4V. The model returned a fluent answer to our question without having to build our own two-stage process (i.e. classification to identify the plant then GPT-4 to provide plant care advice).</p><h2>Test #2: Optical Character Recognition (OCR)</h2><p>We conducted two tests to explore GPT-4V’s OCR capabilities: OCR on an image with text on a car tire and OCR on a photo of a paragraph from a digital document. Our intent was to build an understanding of how GPT-4V performs at OCR in the wild, where text may have less contrast and be at an angle, versus digital documents with clear text.</p><figure><img src="https://blog.roboflow.com/content/images/2023/09/2023-09-26-17.36.09-1.jpg" alt="" loading="lazy" width="590" height="605"></figure><p><br>GPT-4V was unable to correctly identify the serial number in an image of a tire. Some numbers were correct but there were several errors in the result from the model.</p><p>In our document test, we presented text from a web page and asked GPT-4V to read the text in the image. The model was able to successfully identify the text in the image.</p><figure><img src="https://blog.roboflow.com/content/images/2023/09/File.jpg" alt="" loading="lazy" width="738" height="1600" srcset="https://blog.roboflow.com/content/images/size/w600/2023/09/File.jpg 600w, https://blog.roboflow.com/content/images/2023/09/File.jpg 738w" sizes="(min-width: 720px) 720px"></figure><p>GPT-4V does an excellent job translating words in an image to individual characters in text. A useful insight for tasks related to extracting text from documents.</p><h2>Test #3: Math OCR</h2><p>Math OCR is a specialized form of OCR pertaining specifically to math equations. Math OCR is often considered its own discipline because the syntax of what the OCR model needs to identify extends to a vast range of symbols.</p><p>We presented GPT-4V with a math question. This math question was in a screenshot taken from a document. The question concerns calculating the length of a zip wire given two angles. We presented the image with the prompt “Solve it.”</p><figure><img src="https://blog.roboflow.com/content/images/2023/09/2023-09-27-13.25.51.jpg" alt="" loading="lazy" width="590" height="1280"></figure><figure><img src="https://blog.roboflow.com/content/images/2023/09/photo_2023-09-27-13.25.55.jpeg" alt="" loading="lazy" width="590" height="1280"></figure><p>The model identified the problem can be solved with trigonometry, identified the function to use, and presented a step-by-step walkthrough of how to solve the problem. Then, GPT-4V provided the correct answer to the question.</p><p>With that said, the GPT-4V system card notes that the model may miss mathematical symbols. Different tests, including tests where an equation or expression is written by hand on paper, may indicate deficiencies in the model's ability to answer math questions. </p><h2>Test #4: Object Detection</h2><p><a href="https://blog.roboflow.com/object-detection/">Object detection</a> is a fundamental task in the field of computer vision. We asked GPT-4V to identify the location of various objects to evaluate its ability to perform object detection tasks.</p><p>In our first test, we asked GPT-4V to detect a dog in an image and provide the x_min, y_min, x_max, and y_max values associated with the position of the dog. The bounding box coordinates returned by GPT-4V did not match the position of the dog.</p><figure><img src="https://blog.roboflow.com/content/images/2023/09/photo_2023-09-26-18.51.24.jpeg" alt="" loading="lazy" width="590" height="1280"></figure><p>While GPT-4V’s capabilities at answering questions about an image are powerful, the model is not a substitute for fine-tuned <a href="https://roboflow.com/models/object-detection?ref=blog.roboflow.com">object detection models</a> in scenarios where you want to know where an object is in an image.</p><h2>Test #5: CAPTCHA</h2><p>We decided to test GPT-4V with CAPTCHAs, a task OpenAI studied in their research and wrote about in their <a href="https://cdn.openai.com/papers/GPTV_System_Card.pdf?ref=blog.roboflow.com">system card</a>. We found that GPT-4V was able to identify that an image contained a CAPTCHA but often failed the tests. In a traffic light example, GPT-4V missed some boxes that contained traffic lights.</p><figure><img src="https://blog.roboflow.com/content/images/2023/09/photo_2023-09-27-13.01.22.jpeg" alt="" loading="lazy" width="1031" height="1280" srcset="https://blog.roboflow.com/content/images/size/w600/2023/09/photo_2023-09-27-13.01.22.jpeg 600w, https://blog.roboflow.com/content/images/size/w1000/2023/09/photo_2023-09-27-13.01.22.jpeg 1000w, https://blog.roboflow.com/content/images/2023/09/photo_2023-09-27-13.01.22.jpeg 1031w" sizes="(min-width: 720px) 720px"></figure><p>In the following crosswalk example, GPT-4V classified a few boxes correctly but incorrectly classified one box in the CAPTCHA as a crosswalk.</p><figure><img src="https://lh4.googleusercontent.com/sUn71XmNZHeS4C9U1KGZm9T12MPiDaWSnjeqqZXSTan3I01VVBMvJ0_8knDTQW6kO1YJS8jLXswk_zEyINNDQz7mwDT60e_NoKrikqwaKuULsM9upmURmKCZ7STF6INGj4FtvEY3jlIjvgpVi1eamCI" alt="" loading="lazy" width="248" height="325"></figure><h2>Test #6: Crosswords and Sudoku's</h2><p>We decided to test how GPT-4V performs on crosswords and sudokus.</p><p>First, we prompted GPT-4V with photos of a crossword with the text instruction "Solve it." GPT-4V inferred the image contained a crossword and attempted to provide a solution to the crossword. The model appeared to read the clues correctly but misinterpreted the structure of the board. As a result, the provided answers were incorrect.</p><figure><img src="https://lh6.googleusercontent.com/bXAg1SiRBcs-huLBicWFzkeKI8NxB5OE1zoa1cAvC8sqfU1aFmZ2MRDKd2PTKxafivJsaY3R189vJYPEx0BzrXyWwy5ta2TEaGU2yKrBrOxqCYiQhAM93N4SDvZu6Wb7S3lCGaB2j9PxUCvuqbWD8os" alt="" loading="lazy" width="272" height="592"></figure><p>This same limitation was exhibited in our sudoku test, where GPT-4V identified the game but misunderstood the structure of the board and thus returned inaccurate results:</p><figure><img src="https://lh4.googleusercontent.com/U9cH5wYei3jZN8mmAA6etp3ngH8Zu0YrpLisXW6CEO0uSDB-FW3UO7PDLm-u5sEwc6Isvvh3BP_qizYEZctgWRUQpt8oP2_ius6vKGvUmTmAdcn6eneWiAOgq1O6n2W1LV7rx6a6hmDXLxrHs7IkxZI" alt="" loading="lazy" width="431" height="936"></figure><h2>GPT-4V Limitations and Safety</h2><p>OpenAI conducted research with an alpha version of the vision model available to a small group of users, as outlined in the official <a href="https://cdn.openai.com/papers/GPTV_System_Card.pdf?ref=blog.roboflow.com">GPT-4V(ision) System Card</a>. During this process, they were able to gather feedback and insights on how GPT-4V works with prompts provided by a range of people. This was supplemented with “red teaming”, wherein external experts were “to qualitatively assess the limitations and risks associated with the model and system”.</p><p>Based on OpenAI’s research, the GPT-4V system card notes numerous limitations with the model such as:</p><ol><li>Missing text or characters in an image</li><li>Missing mathematical symbols</li><li>Being unable to recognize spatial locations and colors</li></ol><p>In addition to limitations, OpenAI identified, researched, and attempted to mitigate several risks associated with the model. For example, GPT-4V avoids identifying a specific person in an image and does not respond to prompts pertaining to hate symbols.</p><p>With that said, there is further work to be done in model safeguarding. For example, OpenAI notes in the model system card that “If prompted, GPT-4V can generate content praising certain lesser known hate groups in response to their symbols.”,</p><h2>GPT-4V for Computer Vision and Beyond</h2><p>GPT-4V is a notable movement in the field of machine learning and natural language processing. With GPT-4V, you can ask questions about an image – and follow up questions – in natural language and the model will attempt to ask your question.</p><p>GPT-4V performed well at various general image questions and demonstrated awareness of context in some images we tested. For instance, GPT-4V was able to successfully answer questions about a movie featured in an image without being told in text what the movie was.</p><p>For general question answering, GPT-4V is exciting. While models existed for this purpose in the past, they often lacked fluency in their answers. GPT-4V is able to both answer questions and follow up questions about an image and do so in depth.</p><p>With GPT-4V, you can ask questions about an image without creating a two-stage process (i.e. classification then using the results to ask a question to a language model like GPT). There will likely be limitations to what GPT-4V can understand, hence testing a use case to understand how the model performs is crucial.</p><p>With that said, GPT-4V has its limitations. The model did “hallucinate”, wherein the model returned inaccurate information. This is a risk with using language models to answer questions. Furthermore, the model was unable to accurately return bounding boxes for object detection, suggesting it is unfit for this use case currently.</p><p>We also observed that GPT-4V is unable to answer questions about people. When given a photo of Taylor Swift and asked who was featured in the image, the model declined to answer. OpenAI define this as an expected behavior in the published system card.</p><p>Interested in reading more of our experiments with multi-modal language models and GPT-4’s impact on computer vision? Check out the following guides:</p><ul><li><a href="https://blog.roboflow.com/gpt-4-impact-speculation/">Speculating on How GPT-4 Changes Computer Vision</a> (<a href="https://www.youtube.com/watch?v=aNLl0wEdMq4&amp;ref=blog.roboflow.com">Video</a>)</li><li><a href="https://blog.roboflow.com/how-good-is-bing-gpt-4-multimodality/">How Good Is Bing (GPT-4) Multimodality?</a></li><li><a href="https://blog.roboflow.com/chatgpt-code-interpreter-computer-vision/">ChatGPT Code Interpreter for Computer Vision</a></li></ul></div>
            
            <div>
              <h3>Cite this post:</h3>
              <p><em>"<a href="/author/james/">James Gallagher</a>, <a href="/author/skalskip/">Piotr Skalski</a>." Roboflow Blog, Sep 27, 2023. https://blog.roboflow.com/gpt-4-vision/</em></p>
            </div>
          </div>
        
        <div>
          <div>
            <div>
              <img src="https://media.roboflow.com/stats.webp">
            </div>
            <div>
              <h2>Build and deploy computer vision models with Roboflow</h2>
              <p>Join over 250,000 developers and top-tier companies from Rivian Automotive to Cardinal Health building computer vision models with Roboflow.</p>
              <a href="https://app.roboflow.com">
                
              </a>
            </div>
          </div>
        <div>
          
            <div></div>
          
          <div>
            <h3>James Gallagher</h3>
            <p>James is a Technical Marketer at Roboflow, working toward democratizing access to computer vision.</p>
            <a href="https://blog.roboflow.com/author/james/">
              <div>VIEW&nbsp;MORE&nbsp;POSTS</div>
            </a>
          </div>
        </div>
        <div>
          <div>TOPICS:</div>
          <div><a href="/tag/computer-vision/">Computer Vision</a>, <a href="/tag/news/">News</a></div>
        </div>
      </div>
      </div>
      <div>
        
  <div>
    <h4>Build and deploy with Roboflow for free</h4>
    <div>Use Roboflow to manage datasets, train models in one-click, and deploy to web, mobile, or the edge.</div>
    <div>
      <a href="https://app.roboflow.com">Try It Now</a>
    </div>
  </div>
        
            <div>
    </div>
        <div>  

      <div>
        
        <h6>Subscribe to our newsletter</h6>
        <div>
          
        </div>
      </div>
            <div>
              <h6>Table of Contents</h6>
            </div>
            
          <div>
            <h4>RECOMMENDED&nbsp;READS</h4>
          </div>
          
            <div>
              
                
                  <div>
                    <a href="/vacuuming-test-computer-vision/">
                      <h6>How I Built a System to Test My Vacuuming Skills</h6>
                    </a>
                  </div>
                
              
                
                  <div>
                    <a href="/squirrel-detection-computer-vision/">
                      <h6>Transforming the Raspberry Pi into a Squirrel Sentry with Computer Vision</h6>
                    </a>
                  </div>
                
              
                
                  <div>
                    <a href="/wheel-of-fortune-game/">
                      <h6>How I Built a Wheel of Fortune Game with Roboflow</h6>
                    </a>
                  </div>
                
              
            </div>
            
          
        </div>
      </div>
    </div>
  
  
    
      <div>
        <div>
          <div>
            <h4>MORE ABOUT</h4>
            <h4>Computer Vision</h4>
          </div>
          <a href="https://blog.roboflow.com/tag/computer-vision/">
            <div>View All</div>
          </a>
        </div>
        
          <div>
            
              <div>
                <a href="/vacuuming-test-computer-vision/">
                  <div></div>
                </a>
                <div>
                  <a href="/vacuuming-test-computer-vision/">
                    <h5>How I Built a System to Test My Vacuuming Skills</h5>
                  </a>
                  <div>
                    <a href="https://blog.roboflow.com/author/reed/">
                      <div>Reed Johnson</div>
                      <div></div>
                    </a>
                    
                      <div>Oct 2, 2023</div>
                    
                  </div>
                </div>
              </div>
            
              <div>
                <a href="/squirrel-detection-computer-vision/">
                  <div></div>
                </a>
                <div>
                  <a href="/squirrel-detection-computer-vision/">
                    <h5>Transforming the Raspberry Pi into a Squirrel Sentry with Computer Vision</h5>
                  </a>
                  <div>
                    <a href="https://blog.roboflow.com/author/contributing-writer/">
                      <div>Contributing Writer</div>
                      <div></div>
                    </a>
                    
                      <div>Sep 27, 2023</div>
                    
                  </div>
                </div>
              </div>
            
              <div>
                <a href="/wheel-of-fortune-game/">
                  <div></div>
                </a>
                <div>
                  <a href="/wheel-of-fortune-game/">
                    <h5>How I Built a Wheel of Fortune Game with Roboflow</h5>
                  </a>
                  <div>
                    <a href="https://blog.roboflow.com/author/contributing-writer/">
                      <div>Contributing Writer</div>
                      <div></div>
                    </a>
                    
                      <div>Sep 25, 2023</div>
                    
                  </div>
                </div>
              </div>
            
              <div>
                <a href="/what-is-detr/">
                  <div></div>
                </a>
                <div>
                  <a href="/what-is-detr/">
                    <h5>What is DETR?</h5>
                  </a>
                  <div>
                    <a href="https://blog.roboflow.com/author/potrimba/">
                      <div>Petru Potrimba</div>
                      <div></div>
                    </a>
                    
                      <div>Sep 25, 2023</div>
                    
                  </div>
                </div>
              </div>
            
              <div>
                <a href="/what-is-r-cnn/">
                  <div></div>
                </a>
                <div>
                  <a href="/what-is-r-cnn/">
                    <h5>What is R-CNN?</h5>
                  </a>
                  <div>
                    <a href="https://blog.roboflow.com/author/potrimba/">
                      <div>Petru Potrimba</div>
                      <div></div>
                    </a>
                    
                      <div>Sep 25, 2023</div>
                    
                  </div>
                </div>
              </div>
            
              <div>
                <a href="/package-detector/">
                  <div></div>
                </a>
                <div>
                  <a href="/package-detector/">
                    <h5>Training a Custom Package Detection Model with Two Labeled Images</h5>
                  </a>
                  <div>
                    <a href="https://blog.roboflow.com/author/andrew-healey/">
                      <div>Andrew Healey</div>
                      <div></div>
                    </a>
                    
                      <div>Sep 25, 2023</div>
                    
                  </div>
                </div>
              </div>
            
          </div>
          
        
      </div>
    
  
  <a href="#"></a>
  <div>

</div>



<!-- [if lte IE 9]><script src="https://cdnjs.cloudflare.com/ajax/libs/placeholders/3.0.2/placeholders.min.js"></script><![endif] -->
<!--  Start of Site Search 360 script (put right before the closing </body> tag)  -->

<!--  End of Site Search 360 script  -->
</div>






  




<!-- fix image gallery aspect ratio via https://forum.ghost.org/t/error-ghost-gallery/5909/3 -->




<!-- fix image gallery aspect ratio via https://forum.ghost.org/t/error-ghost-gallery/5909/3 -->

<div></div><div></div><div><div></div>
       <div></div></div><div><h2>Search</h2><section><label for="ss360-custom-searchbox">Search query</label><input type="search" placeholder="Search our blog"></section><div></div></div><section></section><div><div><div></div><div></div></div><div><a><span><!--v-if--></span><span><span><span><!--v-if--></span></span></span></a></div></div></body></html>`

const pageUrl = "https://mistral.ai/news/announcing-mistral-7b/";

export type ImageInfo = {
  url: string;
  description: string;
};

function extractImages(text: string): ImageInfo[] {
  const imageRegex =
    /<Image>\s*<URL>\s*(.*?)\s*<\/URL>\s*<Description>\s*(.*?)\s*<\/Description>\s*<\/Image>/gs;
  const images: ImageInfo[] = [];

  let match;
  while ((match = imageRegex.exec(text)) !== null) {
    const url = match[1].trim();
    const description = match[2].trim();

    images.push({ url, description });
  }

  return images;
}

const promptTemplateBase = new PromptTemplate({
  template: `Extrait toutes les images du HTML.
  Pour chaque image, décrit la en utilisant l'URL de l'image et le contexte de l'image sur la page.
  Donne l'URL entière de l'image. Elle sont extraites depuis l'article {pageUrl}. Voila le contenu:
  
  {bodyHTML}
  
  Repète ce format de réponse pour chaque image:
  <Image>
    <URL>
      // url de l'image
    </URL>
    <Description>
      // description de l'image en français
    </Description>
  </Image>
  
  Extrait chaque image depuis les tag <img> du HTML.`,
  inputVariables: ["bodyHTML", "pageUrl"],
});

const promptTemplateDelimited = new PromptTemplate({
  template: `Extrait toutes les images du HTML.
  Pour chaque image, décrit la en utilisant l'URL de l'image et le contexte de l'image sur la page.
  Donne l'URL entière de l'image. Elle sont extraites depuis l'article {pageUrl}. Voila le contenu:
  
  # BEGIN HTML
  {bodyHTML}
  # END HTML
  
  Repète ce format de réponse pour chaque image:
  <Image>
    <URL>
      // url de l'image
    </URL>
    <Description>
      // description de l'image en français
    </Description>
  </Image>
  
  Extrait chaque image depuis les tag <img> du HTML.`,
  inputVariables: ["bodyHTML", "pageUrl"],
});

function checkParsing(images: ImageInfo[]) {
  let score = 0;

  for (const image of images) {
    if (image.url && image.description) {
      score++;
    } else {
      score--;
    }
  }

  return score;
}

async function evaluate(
  style: string,
  round: number,
  promptTemplate: PromptTemplate
) {
  const prompt = await promptTemplate.format({
    bodyHTML,
    pageUrl,
  });

  const answer = await model.call(prompt);

  try {
    const images = extractImages(answer);

    return checkParsing(images);
  } catch (error) {
    console.log(error);
    console.log(answer);

    return -1;
  } finally {
    writeFileSync(
      `./prompts/${style}-${round}.txt`,
      prompt + "\n\n-----------------\n\n" + answer
    );
  }
}

async function runBenchmark(
  style: string,
  promptTemplate: PromptTemplate,
  rounds = 20
) {
  const scores: number[][] = [];

  const promises: Promise<any>[] = [];

  for (let round = 0; round < rounds; round++) {
    promises.push(
      evaluate(style, round, promptTemplate).then((score) =>
        scores.push([round, score])
      )
    );
  }

  await Promise.all(promises);

  return scores;
}

async function run() {
  const scoresBase = await runBenchmark("base", promptTemplateBase, 5);
  const scoresDelimited = await runBenchmark(
    "delimited",
    promptTemplateDelimited,
    5
  );

  console.log({
    scoresBase,
    scoresDelimited,
  });

  console.log({
    base: scoresBase.reduce((acc, [_, score]) => acc + score, 0),
    delimited: scoresDelimited.reduce((acc, [_, score]) => acc + score, 0),
  });
}

run();
