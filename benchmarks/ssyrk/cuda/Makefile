CC = nvcc
BIN = bin
HDRS = ../../utils/helpers.h ../../utils/harness.h ../../utils/params.h

all: $(BIN)/ssyrk

$(BIN):
	mkdir -p $(BIN)

$(BIN)/ssyrk: ssyrk.c $(HDRS) | $(BIN)
	$(CC) ssyrk.c -o $(BIN)/ssyrk -lcublas

clean:
	rm -rf $(BIN)
