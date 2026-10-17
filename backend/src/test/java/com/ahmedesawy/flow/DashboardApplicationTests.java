package com.ahmedesawy.flow;

import org.springframework.boot.test.context.SpringBootTest;




@SpringBootTest
class DashboardApplicationTests {

    public static void main(String[] args) {
        Test t = new Test();

        System.out.println(t.generateCode(10));
        
    
    }

}
