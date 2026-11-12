CC = nvcc
BIN = bin
HDRS = ../../utils/helpers.h ../../utils/harness.h ../../utils/params.h

all: $(BIN)/ssymv

$(BIN):
	mkdir -p $(BIN)

$(BIN)/ssymv: ssymv.c $(HDRS) | $(BIN)
	$(CC) ssymv.c -o $(BIN)/ssymv -lcublas

clean:
	rm -rf $(BIN)
