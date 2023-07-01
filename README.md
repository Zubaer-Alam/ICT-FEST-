Prerequisites:

   1. Git    : https://git-scm.com/book/en/v2/Getting-Started-Installing-Git
   2. Docker : https://docs.docker.com/engine/install/

Steps:

   1. Navigate to the directory where you want to clone the repository.

   2. Open a terminal inside the folder and clone the repository:
                
          git clone https://github.com/Zubaer-Alam/ICT-Fest
          
   3. Navigate to the app directory:
            
          cd ICT-Fest
          
   4. Build and run the Docker container:
         
          docker compose up -d
          
   5. Open your browser and access http://localhost:2051 to view the app.

   6. After you have finished viewing the app, stop the container:

          docker compose down
          
   

